import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTables1751364455544 implements MigrationInterface {
    name = 'UpdatedTables1751364455544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" DROP CONSTRAINT "UQ_6aa16a60f6df52ef4a4f7e6816e"`);
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" ADD CONSTRAINT "UQ_db84c5a62833bba3cee861434bf" UNIQUE ("doctor_id", "date", "session", "start_time", "end_time")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" DROP CONSTRAINT "UQ_db84c5a62833bba3cee861434bf"`);
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" ADD CONSTRAINT "UQ_6aa16a60f6df52ef4a4f7e6816e" UNIQUE ("date", "start_time", "end_time", "doctor_id")`);
    }

}
