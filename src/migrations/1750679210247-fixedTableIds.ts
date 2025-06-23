import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedTableIds1750679210247 implements MigrationInterface {
    name = 'FixedTableIds1750679210247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "PK_e2959c517497025482609c0166c"`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP COLUMN "doctor_id"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "PK_bd1c8f471a2198c19f43987ab05"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "patient_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_provider"`);
        await queryRunner.query(`DROP TYPE "public"."user_user_provider_enum"`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "FK_a685e79dc974f768c39e5d12281"`);
        await queryRunner.query(`ALTER TABLE "doctor" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "PK_a685e79dc974f768c39e5d12281" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "REL_a685e79dc974f768c39e5d1228"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_f20f0bf6b734938c710e12c2782"`);
        await queryRunner.query(`ALTER TABLE "patient" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "PK_f20f0bf6b734938c710e12c2782" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "REL_f20f0bf6b734938c710e12c278"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password_hash" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "FK_a685e79dc974f768c39e5d12281" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_f20f0bf6b734938c710e12c2782" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_f20f0bf6b734938c710e12c2782"`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "FK_a685e79dc974f768c39e5d12281"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password_hash" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "REL_f20f0bf6b734938c710e12c278" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "PK_f20f0bf6b734938c710e12c2782"`);
        await queryRunner.query(`ALTER TABLE "patient" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_f20f0bf6b734938c710e12c2782" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "REL_a685e79dc974f768c39e5d1228" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "PK_a685e79dc974f768c39e5d12281"`);
        await queryRunner.query(`ALTER TABLE "doctor" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "FK_a685e79dc974f768c39e5d12281" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TYPE "public"."user_user_provider_enum" AS ENUM('local', 'google')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "user_provider" "public"."user_user_provider_enum" NOT NULL DEFAULT 'local'`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "patient_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "PK_bd1c8f471a2198c19f43987ab05" PRIMARY KEY ("patient_id")`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD "doctor_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "PK_e2959c517497025482609c0166c" PRIMARY KEY ("doctor_id")`);
    }

}
