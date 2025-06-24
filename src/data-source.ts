import { DataSource } from 'typeorm';
import { User } from './auth/entities/user.entity';
import { config } from 'dotenv';
import { Doctor } from './doctor/entities/doctor.entity';
import { Patient } from './patient/entities/patient.entity';
import { DoctorAvailability } from './doctor/entities/doctor-availability.entity';
import { DoctorTimeSlot } from './doctor/entities/doctor-time-slot.entity';

config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Doctor, Patient, DoctorAvailability, DoctorTimeSlot],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
});
