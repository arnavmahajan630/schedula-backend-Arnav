import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScheduleTypeToDoctors1750988053786 implements MigrationInterface {
  name = 'AddScheduleTypeToDoctors1750988053786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "doctors"
      ADD COLUMN "schedule_Type" VARCHAR NOT NULL DEFAULT 'stream'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "doctors"
      DROP COLUMN "schedule_Type"
    `);
  }
}
