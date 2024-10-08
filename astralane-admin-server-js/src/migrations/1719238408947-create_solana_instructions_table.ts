import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSolanaInstructionsTable1719238408947
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "solana_instructions" (
          "block_slot" bigint,
          "tx_id" varchar,
          "tx_index" bigint,
          "program_id" varchar,
          "is_inner" boolean,
          "data" varchar,
          "account_arguments" varchar[],
          "tx_signer" varchar,
          "tx_success" boolean
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "solana_instructions";
    `);
  }
}
