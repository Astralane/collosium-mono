import { client } from '../../src/astralineClient';

client.registerProcessedTxCallback((tx) => {
  console.log(`Processed tx received: ${JSON.stringify(tx)}\n`);
});

client.registerUnprocessedTxCallback((tx) => {
  console.log(`Unprocessed tx received: ${JSON.stringify(tx)}\n`);
});
