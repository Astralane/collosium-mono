import { AstralineClient } from "@astraline/streaming-client";

const client = new AstralineClient('key_1');

client.registerProcessedTxCallback('72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ', (tx) => {
  console.log(`Processed tx received: ${JSON.stringify(tx)}\n`);
});

client.registerUnprocessedTxCallback('72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ', (tx) => {
  console.log(`Unprocessed tx received: ${JSON.stringify(tx)}\n`);
});
