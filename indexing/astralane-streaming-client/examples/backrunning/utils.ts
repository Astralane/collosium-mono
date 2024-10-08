import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';

const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

export async function sendMemoTransaction(
    connection: Connection,
    fromKeypair: Keypair,
    message: string,
): Promise<string> {
    const tx = new Transaction();

    tx.add(
        new TransactionInstruction({
            keys: [
                { pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true },
            ],
            data: Buffer.from(message, 'utf-8'),
            programId: new PublicKey(MEMO_PROGRAM_ID),
        }),
    );

    const result = await sendAndConfirmTransaction(connection, tx, [fromKeypair]);
    return result;
}
