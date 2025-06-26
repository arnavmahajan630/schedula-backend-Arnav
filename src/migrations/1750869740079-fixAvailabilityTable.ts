import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAvailabilityTable1750869740079 implements MigrationInterface {
    name = 'FixAvailabilityTable1750869740079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" ADD CONSTRAINT "UQ_34ae84a982de88612ac9fd7dca6" UNIQUE ("doctor_id", "date", "startTime", "endTime")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_availabilities" DROP CONSTRAINT "UQ_34ae84a982de88612ac9fd7dca6"`);
    }

}
