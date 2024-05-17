// import { client } from "@astraline/streaming-client";
import { AstralineClient } from '../../dist/index';

const client = new AstralineClient('key_3');

client.registerProcessedTxCallback('4dv4puYib9XZXHrTN5csFxzfWKSmetTu1dLsJWNNV2XZ', (tx) => {
  console.log(`Processed tx received: ${JSON.stringify(tx)}\n`);
});

client.registerUnprocessedTxCallback('4dv4puYib9XZXHrTN5csFxzfWKSmetTu1dLsJWNNV2XZ', (tx) => {
  console.log(`Unprocessed tx received: ${JSON.stringify(tx)}\n`);
});
