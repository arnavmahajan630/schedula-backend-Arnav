import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Doctor } from './Doctor';
import { Patient } from './Patient';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctorProfile?: Doctor;

  @OneToOne(() => Patient, (patient) => patient.user)
  patientProfile?: Patient;
}
