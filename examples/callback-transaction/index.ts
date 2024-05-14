import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { sendMemoTransaction } from './utils';
import { client } from "@astraline/streaming-client";

const CONNECTION = new Connection('http://127.0.0.1:8899', 'confirmed');
const FROM_KEYPAIR = new Keypair();

async function main() {
  const signature = await CONNECTION.requestAirdrop(
    FROM_KEYPAIR.publicKey,
    10 * LAMPORTS_PER_SOL,
  );
  await CONNECTION.confirmTransaction(signature);

  client.registerProcessedTxCallback('72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ', async () => {
    let tx = await sendMemoTransaction(CONNECTION, FROM_KEYPAIR, 'I am memo tx');
    console.log("memo tx: " + tx);
    // the next line was added to avoid infinite loop
    process.exit(0);
  });
}

main();
