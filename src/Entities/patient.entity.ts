import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  patient_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  gender: string;

  @Column()
  dob: string;

  @Column()
  address: string;

  @Column()
  emergency_contact: string;

  @Column()
  medical_history: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Appointment, (appt) => appt.patient)
  appointments: Appointment[];
}
