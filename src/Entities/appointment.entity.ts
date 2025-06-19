import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';
import { TimeSlot } from './timeslot.entity';
@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    onDelete: 'CASCADE',
  })
  patient: Patient;

  @ManyToOne(() => TimeSlot, { onDelete: 'SET NULL' })
  time_slot: TimeSlot;

  @Column()
  appointment_date: string; // store as "YYYY-MM-DD"

  @Column()
  appointment_status: string;

  @Column()
  reason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
