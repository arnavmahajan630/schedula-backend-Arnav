import { DataSource } from 'typeorm';
import { User } from './auth/entities/user.entity';
import { config } from 'dotenv';
import { Doctor } from './auth/entities/doctor.entity';
import { Patient } from './auth/entities/patient.entity';

config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Doctor, Patient],
  //migrations: ['dist/migrations/*.js'],
  //migrationsRun: true,
  synchronize: true,
});
