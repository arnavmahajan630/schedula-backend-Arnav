import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Appointment } from './Appointment';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.patientProfile)
  @JoinColumn()
  user: User;

  @Column()
  age: number;

  @Column('text', { array: true })
  medicalHistory: string[];

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
