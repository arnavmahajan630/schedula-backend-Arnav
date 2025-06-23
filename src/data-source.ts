import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],   
  //migrations: ['dist/migrations/*.js'], 
  //migrationsRun: true,
  synchronize: true,
});

