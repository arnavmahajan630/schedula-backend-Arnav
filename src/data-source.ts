import { DataSource } from 'typeorm';
import { User } from './auth/entities/user.entity';
import { config } from 'dotenv';

config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
});
