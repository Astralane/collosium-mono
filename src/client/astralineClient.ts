import { VersionedTransaction } from '@solana/web3.js';
import { deserializeTransactions } from 'jito-ts/dist/sdk/block-engine/utils';
import { PacketBatch } from 'jito-ts/dist/gen/block-engine/packet';
import streamingClient from './grpcStreamingServiceClient';
import { TimestampedTransactionUpdate } from '../grpc/geyser';
import { SubscribePacketsResponse } from '../grpc/streaming_service';

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
}

export default AstralineClient;
