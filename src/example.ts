import { TimestampedTransactionUpdate } from 'src/types/geyser/solana/geyser/TimestampedTransactionUpdate';
import geyserClient from './grpcGeyserClient';

function handleTransactionUpdates() {
  const call = geyserClient.subscribeTransactionUpdates({});

  call.on('data', (data: TimestampedTransactionUpdate) => {
    console.log('Transaction Update:', data);
  });

  call.on('error', (error: Error) => {
    console.error('Error:', error);
  });

  call.on('end', () => {
    console.log('Stream ended');
  });
}

handleTransactionUpdates();
