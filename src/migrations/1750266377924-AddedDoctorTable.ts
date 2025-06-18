import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDoctorTable1750266377924 implements MigrationInterface {
    name = 'AddedDoctorTable1750266377924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctors" ("doctor_id" SERIAL NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "specialization" character varying NOT NULL, "experience_years" integer NOT NULL DEFAULT '0', "education" character varying NOT NULL, "clinic_name" character varying NOT NULL, "clinic_address" character varying NOT NULL, "available_days" text NOT NULL, "available_time_slots" text NOT NULL, "hashed_refresh_token" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_62069f52ebba471c91de5d59d61" UNIQUE ("email"), CONSTRAINT "PK_24821d9468276ddc40107fc0819" PRIMARY KEY ("doctor_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "doctors"`);
    }

}
