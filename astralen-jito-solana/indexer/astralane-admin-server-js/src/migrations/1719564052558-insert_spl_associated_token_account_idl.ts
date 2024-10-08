import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSplAssociatedTokenAccountIdl1719564052558
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const idl = {
      version: '1.1.1',
      name: 'spl_associated_token_account',
      instructions: [
        {
          name: 'create',
          accounts: [
            { name: 'fundingAddress', isMut: true, isSigner: true },
            { name: 'associatedAccountAddress', isMut: true, isSigner: false },
            { name: 'walletAddress', isMut: false, isSigner: false },
            { name: 'tokenMintAddress', isMut: false, isSigner: false },
            { name: 'systemProgram', isMut: false, isSigner: false },
            { name: 'tokenProgram', isMut: false, isSigner: false },
          ],
          args: [],
        },
        {
          name: 'createIdempotent',
          accounts: [
            { name: 'fundingAddress', isMut: true, isSigner: true },
            { name: 'associatedAccountAddress', isMut: true, isSigner: false },
            { name: 'walletAddress', isMut: false, isSigner: false },
            { name: 'tokenMintAddress', isMut: false, isSigner: false },
            { name: 'systemProgram', isMut: false, isSigner: false },
            { name: 'tokenProgram', isMut: false, isSigner: false },
          ],
          args: [],
        },
        {
          name: 'recoverNested',
          accounts: [
            {
              name: 'nestedAssociatedAccountAddress',
              isMut: true,
              isSigner: false,
            },
            { name: 'nestedTokenMintAddress', isMut: false, isSigner: false },
            {
              name: 'destinationAssociatedAccountAddress',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'ownerAssociatedAccountAddress',
              isMut: false,
              isSigner: false,
            },
            { name: 'ownerTokenMintAddress', isMut: false, isSigner: false },
            { name: 'walletAddress', isMut: true, isSigner: true },
            { name: 'tokenProgram', isMut: false, isSigner: false },
          ],
          args: [],
        },
      ],
      errors: [
        {
          code: 0,
          name: 'InvalidOwner',
          msg: 'Associated token account owner does not match address derivation',
        },
      ],
    };

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('program_idl')
        .values({
          program_pubkey: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
          idl: idl,
        })
        .orUpdate(['idl'], ['program_pubkey'])
        .execute();
    } catch (error) {
      console.error('Error inserting IDL:', error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `DELETE FROM program_idl WHERE program_pubkey = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';`,
      );
    } catch (error) {
      console.error('Error deleting IDL:', error);
    }
  }
}
