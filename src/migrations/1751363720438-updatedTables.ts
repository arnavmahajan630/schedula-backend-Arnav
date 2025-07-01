import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTables1751363720438 implements MigrationInterface {
    name = 'UpdatedTables1751363720438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."doctor_time_slots_session_enum" AS ENUM('Morning', 'Evening')`);
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" ADD "session" "public"."doctor_time_slots_session_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" DROP COLUMN "session"`);
        await queryRunner.query(`DROP TYPE "public"."doctor_time_slots_session_enum"`);
    }

}
