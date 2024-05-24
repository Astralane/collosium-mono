import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { sendMemoTransaction } from './utils';
import { AstralineClient } from "../../src/client/astralineClient";

// rate-limited port: 42069
const CONNECTION = new Connection('http://127.0.0.1:42069', {
  httpHeaders: {
    "Content-Type": "application/json",
    "Api-Key": "key_1"
  }
});
const FROM_KEYPAIR = new Keypair();
const client = new AstralineClient('key_1');

async function main() {
  const signature = await CONNECTION.requestAirdrop(
    FROM_KEYPAIR.publicKey,
    1000 * LAMPORTS_PER_SOL,
  );

  for (let i = 0; i < 10; i++) {
    let tx = await sendMemoTransaction(CONNECTION, FROM_KEYPAIR, 'I am memo tx');
    console.log("memo tx: "+ tx)
  }
}

main();
