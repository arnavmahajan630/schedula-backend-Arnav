import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1750612779227 implements MigrationInterface {
    name = 'UpdateUserTable1750612779227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "provider" TO "user_provider"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_provider"`);
        await queryRunner.query(`CREATE TYPE "public"."user_user_provider_enum" AS ENUM('local', 'google')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "user_provider" "public"."user_user_provider_enum" NOT NULL DEFAULT 'local'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_provider"`);
        await queryRunner.query(`DROP TYPE "public"."user_user_provider_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "user_provider" character varying`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "user_provider" TO "provider"`);
    }

}
