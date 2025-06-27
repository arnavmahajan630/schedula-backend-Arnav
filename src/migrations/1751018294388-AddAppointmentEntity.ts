import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppointmentEntity1751018294388 implements MigrationInterface {
  name = 'AddAppointmentEntity1751018294388';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "patientUserId" integer,
        "doctorTimeSlotTimeslotId" integer,
        CONSTRAINT "UQ_132e5a3f98676f8a982e1d67a61" UNIQUE ("patientUserId", "doctorTimeSlotTimeslotId"),
        CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "appointments"
      ADD CONSTRAINT "FK_appointment_patient"
      FOREIGN KEY ("patientUserId")
      REFERENCES "patients"("user_id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "appointments"
      ADD CONSTRAINT "FK_appointment_timeslot"
      FOREIGN KEY ("doctorTimeSlotTimeslotId")
      REFERENCES "doctor_time_slots"("timeslot_id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointment_timeslot"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointment_patient"`);
    await queryRunner.query(`DROP TABLE "appointments"`);
  }
}
