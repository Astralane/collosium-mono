import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexConfigurationTable1719234903465
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "index_configuration" (
            "id" bigserial NOT NULL,
            "table_name" text,
            "name" text,
            "index_id" uuid NOT NULL unique,
            "json_config" jsonb,
            "api_key" text
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "index_configuration";
    `);
  }
}
