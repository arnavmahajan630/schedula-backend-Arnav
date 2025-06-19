import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DoctorDetails } from './doctor.entity';

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorDetails)
  doctor: DoctorDetails;

  @Column()
  dayOfWeek: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}
