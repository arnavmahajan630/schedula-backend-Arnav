import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDocterAndPatientTable1750331414915 implements MigrationInterface {
    name = 'AddedDocterAndPatientTable1750331414915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctor" ("doctor_id" SERIAL NOT NULL, "education" character varying NOT NULL, "specialization" character varying NOT NULL, "experience_years" integer NOT NULL, "clinic_name" character varying NOT NULL, "clinic_address" character varying NOT NULL, "available_days" character varying NOT NULL, "available_time_slots" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_a685e79dc974f768c39e5d1228" UNIQUE ("user_id"), CONSTRAINT "PK_e2959c517497025482609c0166c" PRIMARY KEY ("doctor_id"))`);
        await queryRunner.query(`CREATE TABLE "patient" ("patient_id" SERIAL NOT NULL, "age" integer NOT NULL, "gender" character varying NOT NULL, "address" character varying NOT NULL, "emergency_contact" character varying NOT NULL, "medical_history" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_f20f0bf6b734938c710e12c278" UNIQUE ("user_id"), CONSTRAINT "PK_bd1c8f471a2198c19f43987ab05" PRIMARY KEY ("patient_id"))`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "FK_a685e79dc974f768c39e5d12281" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_f20f0bf6b734938c710e12c2782" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_f20f0bf6b734938c710e12c2782"`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "FK_a685e79dc974f768c39e5d12281"`);
        await queryRunner.query(`DROP TABLE "patient"`);
        await queryRunner.query(`DROP TABLE "doctor"`);
    }

}
