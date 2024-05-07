import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { client } from '../../src/astralineClient';
import { sendMemoTransaction } from './utils';

const CONNECTION = new Connection('http://127.0.0.1:8899', 'confirmed');
const FROM_KEYPAIR = new Keypair();

async function main() {
  const signature = await CONNECTION.requestAirdrop(
    FROM_KEYPAIR.publicKey,
    10 * LAMPORTS_PER_SOL,
  );
  await CONNECTION.confirmTransaction(signature);

  client.registerProcessedTxCallback(async () => {
    await sendMemoTransaction(CONNECTION, FROM_KEYPAIR, 'I am memo tx');
    // the next line was added to avoid infinite loop
    process.exit(0);
  });
}

main();
