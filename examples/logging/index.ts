import { client } from '../../src/astralineClient';

client.registerProcessedTxCallback((tx) => {
  console.log('processed tx received: ' + JSON.stringify(tx));
});

client.registerUnprocessedTxCallback((tx) => {
  console.log('unprocessed tx received: ' + JSON.stringify(tx));
});
