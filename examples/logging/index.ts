import { AstralineClient } from '../../src/client/astralineClient';

const client = new AstralineClient('key_1');

client.registerProcessedTxCallback([
  '72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ',
  '9dnyLvZr4ACpQUAp4Bg2Zj6LtrC2zAnAs2tYBawBAzkT',
  '76r3SYVRX94f7R8kVdtNC26ts1mYq8J2oyzmhJaw1MES',
], (tx) => {
  console.log(`Processed tx received: ${JSON.stringify(tx)}\n`);
});

client.registerUnprocessedTxCallback([
  '72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ',
  '9dnyLvZr4ACpQUAp4Bg2Zj6LtrC2zAnAs2tYBawBAzkT',
  '76r3SYVRX94f7R8kVdtNC26ts1mYq8J2oyzmhJaw1MES',
  ]
  , (tx) => {
  console.log(`Unprocessed tx received: ${JSON.stringify(tx)}\n`);
});
