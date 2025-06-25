import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { UserProvider, UserRole } from '../enums/user.enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password_hash: string;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
    name: 'role',
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserProvider,
    default: UserProvider.LOCAL,
    name: 'provider',
  })
  provider: UserProvider;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'hashed_refresh_token',
  })
  hashed_refresh_token: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Doctor, (doctor) => doctor.user, { cascade: true })
  doctor: Doctor;

  @OneToOne(() => Patient, (patient) => patient.user, { cascade: true })
  patient: Patient;
}
