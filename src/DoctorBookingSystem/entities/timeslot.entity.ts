import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DoctorDetails } from './doctor.entity';

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorDetails)
  doctor: DoctorDetails;

  @Column()
  date: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}