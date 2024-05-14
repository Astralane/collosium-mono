import { client } from "@astraline/streaming-client";

client.registerProcessedTxCallback('72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ', (tx) => {
  console.log(`Processed tx received: ${JSON.stringify(tx)}\n`);
});

client.registerUnprocessedTxCallback('72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ', (tx) => {
  console.log(`Unprocessed tx received: ${JSON.stringify(tx)}\n`);
});
