import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProgramIdlTable1719311310392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "program_idl" (
          "id" bigserial NOT NULL,
          "program_pubkey" text NOT NULL unique,
          "idl" jsonb
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "program_idl";
    `);
  }
}
