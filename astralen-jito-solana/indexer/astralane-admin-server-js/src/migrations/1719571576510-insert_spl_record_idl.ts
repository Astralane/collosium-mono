import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSplRecordIdl1719571576510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const idl = {
      version: '0.1.0',
      name: 'spl_record',
      instructions: [
        {
          name: 'initialize',
          accounts: [
            {
              name: 'recordAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'authority',
              isMut: false,
              isSigner: false,
            },
          ],
          args: [],
        },
        {
          name: 'write',
          accounts: [
            {
              name: 'recordAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'signer',
              isMut: false,
              isSigner: true,
            },
          ],
          args: [
            {
              name: 'offset',
              type: 'u64',
            },
            {
              name: 'data',
              type: 'bytes',
            },
          ],
        },
        {
          name: 'setAuthority',
          accounts: [
            {
              name: 'recordAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'signer',
              isMut: false,
              isSigner: true,
            },
            {
              name: 'newAuthority',
              isMut: false,
              isSigner: false,
            },
          ],
          args: [],
        },
        {
          name: 'closeAccount',
          accounts: [
            {
              name: 'recordAccount',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'signer',
              isMut: false,
              isSigner: true,
            },
            {
              name: 'receiver',
              isMut: true,
              isSigner: false,
            },
          ],
          args: [],
        },
      ],
      accounts: [
        {
          name: 'RecordData',
          type: {
            kind: 'struct',
            fields: [
              {
                name: 'version',
                type: 'u8',
              },
              {
                name: 'authority',
                type: 'publicKey',
              },
              {
                name: 'data',
                type: {
                  defined: 'Data',
                },
              },
            ],
          },
        },
      ],
      types: [
        {
          name: 'Data',
          type: {
            kind: 'struct',
            fields: [
              {
                name: 'bytes',
                type: {
                  array: ['u8', 8],
                },
              },
            ],
          },
        },
      ],
      errors: [
        {
          code: 0,
          name: 'IncorrectAuthority',
          msg: 'Incorrect authority provided on update or delete',
        },
        {
          code: 1,
          name: 'Overflow',
          msg: 'Calculation overflow',
        },
      ],
    };

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('program_idl')
        .values({
          program_pubkey: 'ReciQBw6sQKH9TVVJQDnbnJ5W7FP539tPHjZhRF4E9r',
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
        `DELETE FROM program_idl WHERE program_pubkey = 'ReciQBw6sQKH9TVVJQDnbnJ5W7FP539tPHjZhRF4E9r';`,
      );
    } catch (error) {
      console.error('Error deleting IDL:', error);
    }
  }
}
