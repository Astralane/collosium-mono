import { AstralineClient } from "@astraline/streaming-client";

const client = new AstralineClient('some_key');

client.registerProcessedTxCallback([
  '4dv4puYib9XZXHrTN5csFxzfWKSmetTu1dLsJWNNV2XZ',
  '9dnyLvZr4ACpQUAp4Bg2Zj6LtrC2zAnAs2tYBawBAzkT',
  '76r3SYVRX94f7R8kVdtNC26ts1mYq8J2oyzmhJaw1MES',
], (tx) => {
  console.log(`Processed tx received: ${JSON.stringify(tx)}\n`);
});

client.registerUnprocessedTxCallback([
  '4dv4puYib9XZXHrTN5csFxzfWKSmetTu1dLsJWNNV2XZ',
  '9dnyLvZr4ACpQUAp4Bg2Zj6LtrC2zAnAs2tYBawBAzkT',
  '76r3SYVRX94f7R8kVdtNC26ts1mYq8J2oyzmhJaw1MES',
  ]
  , (tx) => {
  console.log(`Unprocessed tx received: ${JSON.stringify(tx)}\n`);
});
