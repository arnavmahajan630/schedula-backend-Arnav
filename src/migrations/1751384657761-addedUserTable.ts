import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserTable1751384657761 implements MigrationInterface {
  name = 'AddedUserTable1751384657761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "email" character varying NOT NULL, "password_hash" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'patient', "provider" "public"."users_provider_enum" NOT NULL DEFAULT 'local', "hashed_refresh_token" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
