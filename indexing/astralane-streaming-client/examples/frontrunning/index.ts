import { AstralineClient } from '../../src/client/astralineClient';
import { createMemoTransaction } from "./utils"
import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

const CONNECTION = new Connection('http://127.0.0.1:8899', 'confirmed');
const FROM_KEYPAIR = new Keypair();
const client = new AstralineClient('key_1');

async function main() {

    const signature = await CONNECTION.requestAirdrop(
        FROM_KEYPAIR.publicKey,
        20 * LAMPORTS_PER_SOL,
    );
    await CONNECTION.confirmTransaction(signature);

    client.registerProcessedTxCallback(['72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ'], (tx) => {
        console.log(`Processed tx received: ${JSON.stringify(tx)}\n`);
    });

    client.registerUnprocessedTxCallback(['72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ'], async (tx) => {
        console.log(`Unprocessed tx received: ${JSON.stringify(tx)}\n`);

        let memoBeforeTx = await createMemoTransaction(CONNECTION, FROM_KEYPAIR, "memo before tx");
        let memoAfterTx = await createMemoTransaction(CONNECTION, FROM_KEYPAIR, "memo after tx");

        await client.sendBundle(CONNECTION, [memoBeforeTx, tx, memoAfterTx], FROM_KEYPAIR, FROM_KEYPAIR.publicKey, 100);
    });

    console.log("Registered all callbacks, listening...");
}

main();
