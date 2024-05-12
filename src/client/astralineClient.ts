import { VersionedTransaction } from '@solana/web3.js';
import { deserializeTransactions } from 'jito-ts/dist/sdk/block-engine/utils';
import { PacketBatch } from 'jito-ts/dist/gen/block-engine/packet';
import streamingClient from './grpcStreamingServiceClient';
import {
  SubscribePacketsResponse,
  TimestampedTransactionUpdate,
} from '../grpc/streaming_service';

export class AstralineClient {
  registerProcessedTxCallback(
    processedTxCallback: (n: TimestampedTransactionUpdate) => void,
  ) {
    const call = streamingClient.subscribeTransactionUpdates({});

    call.on('data', processedTxCallback);

    call.on('error', (error: Error) => {
      console.error('ProcessedTx stream error:', error);
    });

    call.on('end', () => {
      console.log('ProcessedTx stream ended');
    });
  }

  registerUnprocessedTxCallback(
    account: string,
    unprocessedTxCallback: (n: VersionedTransaction) => void,
  ) {
    const call = streamingClient.subscribeUnprocessedPackets({ account });

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
