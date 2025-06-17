import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Doctor } from './Doctor';
import { Appointment } from './Appointment';

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.timeSlots)
  doctor: Doctor;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  isBooked: boolean;

  @OneToOne(() => Appointment, (appointment) => appointment.timeSlot)
  appointment: Appointment;
}
