import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSplNameServiceIdl1719571442356
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const idl = {
      version: '0.2.0',
      name: 'spl_name_service',
      instructions: [
        {
          name: 'create',
          accounts: [
            {
              name: 'systemProgram',
              isMut: false,
              isSigner: false,
            },
            {
              name: 'payer',
              isMut: true,
              isSigner: true,
            },
            {
              name: 'nameAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'nameOwner',
              isMut: false,
              isSigner: false,
            },
          ],
          args: [
            {
              name: 'hashedName',
              type: 'bytes',
            },
            {
              name: 'lamports',
              type: 'u64',
            },
            {
              name: 'space',
              type: 'u32',
            },
          ],
        },
        {
          name: 'update',
          accounts: [
            {
              name: 'nameAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'nameUpdateSigner',
              isMut: false,
              isSigner: true,
            },
          ],
          args: [
            {
              name: 'offset',
              type: 'u32',
            },
            {
              name: 'data',
              type: 'bytes',
            },
          ],
        },
        {
          name: 'transfer',
          accounts: [
            {
              name: 'nameAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'nameOwner',
              isMut: false,
              isSigner: true,
            },
          ],
          args: [
            {
              name: 'newOwner',
              type: 'publicKey',
            },
          ],
        },
        {
          name: 'delete',
          accounts: [
            {
              name: 'nameAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'nameOwner',
              isMut: false,
              isSigner: true,
            },
            {
              name: 'refundTarget',
              isMut: true,
              isSigner: false,
            },
          ],
          args: [],
        },
      ],
      accounts: [
        {
          name: 'NameRecordHeader',
          type: {
            kind: 'struct',
            fields: [
              {
                name: 'parentName',
                type: 'publicKey',
              },
              {
                name: 'owner',
                type: 'publicKey',
              },
              {
                name: 'class',
                type: 'publicKey',
              },
            ],
          },
        },
      ],
      errors: [
        {
          code: 0,
          name: 'OutOfSpace',
          msg: 'Out of space',
        },
      ],
    };

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('program_idl')
        .values({
          program_pubkey: 'namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX',
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
        `DELETE FROM program_idl WHERE program_pubkey = 'namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX';`,
      );
    } catch (error) {
      console.error('Error deleting IDL:', error);
    }
  }
}
