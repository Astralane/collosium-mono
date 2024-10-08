import { VersionedTransaction } from '@solana/web3.js';
import { deserializeTransactions } from 'jito-ts/dist/sdk/block-engine/utils';
import { PacketBatch } from 'jito-ts/dist/gen/block-engine/packet';
import streamingClient from './grpcStreamingServiceClient';
import { TimestampedTransactionUpdate } from '../grpc/geyser';
import { SubscribePacketsResponse } from '../grpc/streaming_service';
import bundleExchangeClient from './grpcBundleExchangeClient';
import * as web3 from '@solana/web3.js';
import { Bundle } from '../types/bundle/bundle';

export class AstralineClient {
  constructor(private readonly apiKey: string) {}

  registerProcessedTxCallback(
    accounts: string[],
    processedTxCallback: (n: TimestampedTransactionUpdate) => void,
  ) {
    const call = streamingClient.subscribeProcessedPackets({
      accounts,
      apiKey: this.apiKey,
    });

    call.on('data', processedTxCallback);

    call.on('error', (error: Error) => {
      console.error('ProcessedTx stream error:', error);
    });

    call.on('end', () => {
      console.log('ProcessedTx stream ended');
    });
  }

  registerUnprocessedTxCallback(
    accounts: string[],
    unprocessedTxCallback: (n: VersionedTransaction) => void,
  ) {
    const call = streamingClient.subscribeUnprocessedPackets({
      accounts,
      apiKey: this.apiKey,
    });

    call.on('data', (response: SubscribePacketsResponse) => {
      if (response.batch != null) {
        const batch = response.batch as unknown as PacketBatch;
        const txs = deserializeTransactions(batch.packets);
        txs.forEach((tx) => {
          unprocessedTxCallback(tx);
        });
      }
    });

    call.on('error', (error: Error) => {
      console.error('UnprocessedTx stream error:', error);
    });

    call.on('end', () => {
      console.log('UnprocessedTx stream ended');
    });
  }

  sendBundle(
    connection: web3.Connection,
    txs: web3.VersionedTransaction[],
    tipPayer: web3.Keypair,
    tipAccount: web3.PublicKey,
    tipAmount: number,
  ): Promise<void> {
    return connection.getLatestBlockhash('processed').then(resp => {
      console.log('created bundle');
      let bundle = new Bundle(txs, 10);

      if (!tipPayer.publicKey.equals(tipAccount)) {
        console.log('adding tip tx');
        const mayBeBundle = bundle.addTipTx(
          tipPayer,
          tipAmount,
          tipAccount,
          resp.blockhash,
        );
        if (mayBeBundle instanceof Error) {
          throw mayBeBundle;
        }
        bundle = mayBeBundle;
      }

      console.log('sending bundle to validator');
      bundleExchangeClient.sendBundle(bundle, (error, response) => {
        if (error != null) {
          console.log(error);
        }
        console.log(response);
      });
    });
  }
}

export default AstralineClient;
