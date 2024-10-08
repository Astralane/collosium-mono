import {
    Keypair,
    PublicKey,
    Connection,
    VersionedTransaction,
    TransactionInstruction,
    TransactionMessage,
} from '@solana/web3.js';

const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

export async function createMemoTransaction(
    connection: Connection,
    fromKeypair: Keypair,
    message: string,
): Promise<VersionedTransaction> {
    let blockhash = await connection
        .getLatestBlockhash()
        .then(res => res.blockhash);

    let instructions = [new TransactionInstruction({
        keys: [
            { pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true },
        ],
        data: Buffer.from(message, 'utf-8'),
        programId: new PublicKey(MEMO_PROGRAM_ID),
    })];

    const messageV0 = new TransactionMessage({
        payerKey: fromKeypair.publicKey,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    // sign your transaction with the required `Signers`
    transaction.sign([fromKeypair]);

    return transaction;
}
