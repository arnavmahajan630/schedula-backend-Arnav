import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Session, Weekday } from '../enums/availability.enums';
import { DoctorTimeSlot } from './doctor-time-slot.entity';

@Entity('doctor_availabilities')
@Unique(['doctor', 'date', 'startTime', 'endTime'])
export class DoctorAvailability {
  @PrimaryGeneratedColumn()
  availability_id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'enum', enum: Session })
  session: Session;

  @Column({ type: 'enum', enum: Weekday, array: true, nullable: true })
  weekdays: Weekday[];

  // Relationships
  @ManyToOne(() => Doctor, (doctor) => doctor.availabilities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @OneToMany(() => DoctorTimeSlot, (slot) => slot.availability, {
    cascade: true,
  })
  time_slots: DoctorTimeSlot[];
}
