import { TimestampedTransactionUpdate } from 'src/types/geyser/solana/geyser/TimestampedTransactionUpdate';
import geyserClient from './grpcGeyserClient';

const web3 = require("@solana/web3.js");
import { VersionedTransaction } from "@solana/web3.js";
import relayerClient from "./grpcRelayerClient";
import { SubscribePacketsResponse } from "./types/relayer/relayer/SubscribePacketsResponse";
import { PacketBatch } from "./types/relayer/packet/PacketBatch";
import { deserializeTransactions } from "jito-ts/dist/sdk/block-engine/utils";

export class AstralineClient {
  registerProcessedTxCallback(
    processedTxCallback: (n: TimestampedTransactionUpdate) => void,
  ) {
    const call = geyserClient.subscribeTransactionUpdates({});

    call.on('data', processedTxCallback);

    call.on('error', (error: Error) => {
      console.error('ProcessedTx stream error:', error);
    });

    call.on('end', () => {
      console.log('ProcessedTx stream ended');
    });
  }

  registerUnprocessedTxCallback(
    unprocessedTxCallback: (n: VersionedTransaction) => void,
  ) {
    const call = relayerClient.subscribeClientPackets({});

    call.on('data', (response: SubscribePacketsResponse) => {
      if (response.batch != null) {
        const batch = response.batch as PacketBatch;
        const txs = deserializeTransactions(batch.packets);
        txs.forEach(tx => {
          unprocessedTxCallback(tx);
        })
      }
    });

    call.on('error', (error: Error) => {
      console.error('UnprocessedTx stream error:', error);
    });

    call.on('end', () => {
      console.log('UnprocessedTx stream ended');
    });
  }
}

const client = new AstralineClient();
export { client };
