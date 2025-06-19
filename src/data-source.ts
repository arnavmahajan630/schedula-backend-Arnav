import { DataSource } from 'typeorm';
import { Doctor } from './auth/entities/doctor.entity';
import { config } from 'dotenv';

config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Doctor],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
});
