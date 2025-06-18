import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Patient } from './Patient';
import { Doctor } from './Doctor';
import { TimeSlot } from './TimeSlot';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column()
  doctorId: string;

  @Column()
  timeSlotId: string;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;

  @OneToOne(() => TimeSlot, (slot) => slot.appointment)
  @JoinColumn()
  timeSlot: TimeSlot;

  @Column()
  reason: string;

  @Column({ type: 'enum', enum: AppointmentStatus })
  status: AppointmentStatus;
}
