import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateKeysTable1719229918578 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "key" (
            "id" bigserial NOT NULL,
            "key" character varying NOT NULL,
            "rpsLimit" integer NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            PRIMARY KEY ("id"),
            UNIQUE ("key")
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP TABLE "key";
        `);
  }
}
