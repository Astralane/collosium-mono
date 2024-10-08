import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSplMemoIdl1719571322479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const idl = {
      version: '3.0.1',
      name: 'spl_memo',
      instructions: [
        {
          name: 'addMemo',
          accounts: [],
          args: [
            {
              name: 'memo',
              type: 'string',
            },
          ],
        },
      ],
    };

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('program_idl')
        .values({
          program_pubkey: 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo',
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
        `DELETE FROM program_idl WHERE program_pubkey = 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo';`,
      );
    } catch (error) {
      console.error('Error deleting IDL:', error);
    }
  }
}
