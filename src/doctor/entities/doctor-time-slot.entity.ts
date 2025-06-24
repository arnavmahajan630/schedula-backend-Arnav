import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DoctorAvailability } from './doctor-availability.entity';
import { Doctor } from './doctor.entity';
import { TimeSlotStatus } from '../enums/availability.enums';

@Entity('doctor_time_slots')
export class DoctorTimeSlot {
  @PrimaryGeneratedColumn()
  timeslot_id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({
    type: 'enum',
    enum: TimeSlotStatus,
    default: TimeSlotStatus.AVAILABLE,
  })
  status: TimeSlotStatus;

  // Relationships
  @ManyToOne(() => Doctor, (doctor) => doctor.time_slots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(
    () => DoctorAvailability,
    (availability) => availability.time_slots,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'availability_id' })
  availability: DoctorAvailability;
}
