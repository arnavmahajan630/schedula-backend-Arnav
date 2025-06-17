import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn()
  slot_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.time_slots, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column()
  day_of_week: string;  // e.g., "Monday"

  @Column()
  start_time: string;   // store as "09:00" format

  @Column()
  end_time: string;
}
