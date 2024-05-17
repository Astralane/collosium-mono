import { BundleExchangeClient } from "./grpcBundleClient/bundle_exchange"
import { ChannelCredentials } from "@grpc/grpc-js";
import * as web3 from '@solana/web3.js';
import { Bundle } from "./types/bundle/bundle";

const bundleExchangeClient = new BundleExchangeClient('127.0.0.1:50051',
    ChannelCredentials.createInsecure());

const connection = new web3.Connection(
    "http://127.0.0.1:8899"
);

export class BundleClient {
    /**
     * send bundle that contains all transactions from 'txs' array and tip transaction from 'tipPayer' to 'tipAccount'
     * if you don't want to send tip transaction, just pass the same account as 'tipPayer' and 'tipAccount'
     */
    async sendBundle(txs: web3.VersionedTransaction[], tipPayer: web3.Keypair, tipAccount: web3.PublicKey, tipAmount: number) {
        const resp = await connection.getLatestBlockhash('processed');
        console.log("created bundle");
        let bundle = new Bundle(txs, 10);

        if (!tipPayer.publicKey.equals(tipAccount)) {
            console.log("adding tip tx")
            let mayBeBundle = bundle.addTipTx(tipPayer, tipAmount, tipAccount, resp.blockhash);
            if (mayBeBundle instanceof Error) {
                throw mayBeBundle;
            }
            bundle = mayBeBundle;
        }

        console.log("sending bundle to validator");
        bundleExchangeClient.sendBundle(bundle, (error, response) => {
            if (error != null) {
                console.log(error);
            }
            console.log(response);
        });
    }
}

const bundleClient = new BundleClient();
export { bundleClient };
