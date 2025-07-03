import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDoctorAvailabilityTable1751385786763
  implements MigrationInterface
{
  name = 'AddedDoctorAvailabilityTable1751385786763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "doctor_availabilities" ("availability_id" SERIAL NOT NULL, "date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "session" "public"."doctor_availabilities_session_enum" NOT NULL, "weekdays" "public"."doctor_availabilities_weekdays_enum" array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "doctor_id" integer, CONSTRAINT "UQ_db84c5a62833bba3cee861434bf" UNIQUE ("doctor_id", "date", "session", "start_time", "end_time"), CONSTRAINT "PK_b72e631ea2d3dc4d641e030ccc1" PRIMARY KEY ("availability_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_availabilities" ADD CONSTRAINT "FK_aa49ce7b9ff575a2963abcb6910" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_availabilities" DROP CONSTRAINT "FK_aa49ce7b9ff575a2963abcb6910"`,
    );
    await queryRunner.query(`DROP TABLE "doctor_availabilities"`);
  }
}
