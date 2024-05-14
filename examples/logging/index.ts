import { client } from "@astraline/streaming-client";

client.registerProcessedTxCallback('account', (tx) => {
  console.log(`Processed tx received: ${JSON.stringify(tx)}\n`);
});

client.registerUnprocessedTxCallback('account', (tx) => {
  console.log(`Unprocessed tx received: ${JSON.stringify(tx)}\n`);
});
