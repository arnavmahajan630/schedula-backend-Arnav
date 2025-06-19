import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TimeSlot } from './timeslot.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  doctor_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  specialization: string;

  @Column()
  experience_years: number;

  @Column()
  education: string;

  @Column()
  clinic_name: string;

  @Column()
  clinic_address: string;

  @Column()
  available_days: string; // e.g., "Mon,Tue,Wed"

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => TimeSlot, (slot) => slot.doctor)
  time_slots: TimeSlot[];

  @OneToMany(() => Appointment, (appt) => appt.doctor)
  appointments: Appointment[];
}
