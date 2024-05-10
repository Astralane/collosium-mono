import geyserClient from './grpcGeyserClient';
import { VersionedTransaction } from '@solana/web3.js';
import relayerClient from './grpcRelayerClient';
import { deserializeTransactions } from 'jito-ts/dist/sdk/block-engine/utils';
import { PacketBatch } from 'jito-ts/dist/gen/block-engine/packet';
import { TimestampedTransactionUpdate } from 'src/grpc/geyser/geyser';
import { SubscribePacketsResponse } from 'src/grpc/relayer/relayer';

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
}

const client = new AstralineClient();
export { client };
