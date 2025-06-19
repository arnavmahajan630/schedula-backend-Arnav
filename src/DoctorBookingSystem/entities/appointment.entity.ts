import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DoctorDetails } from './doctor.entity';
import { PatientDetails } from './patient.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorDetails)
  doctor: DoctorDetails;

  @ManyToOne(() => PatientDetails)
  patient: PatientDetails;

  @Column()
  scheduled_on: Date;

  @Column()
  status: string;
}
