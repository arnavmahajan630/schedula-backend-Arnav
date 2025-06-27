import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DoctorAvailability } from './doctor-availability.entity';
import { Doctor } from './doctor.entity';
import { TimeSlotStatus } from '../enums/availability.enums';
import { Appointment } from 'src/appointment/entities/appointment.entity';

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

  @Column({ type: 'int', nullable: true }) // if null, means stream type
    maxPatients?: number;

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

  @OneToMany(() => Appointment, (appt) => appt.doctorTimeSlot)
appointments: Appointment[];

}
