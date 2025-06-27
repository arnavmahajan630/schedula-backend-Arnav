import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Patient } from 'src/patient/entities/patient.entity';
import { DoctorTimeSlot } from 'src/doctor/entities/doctor-time-slot.entity';

@Entity('appointments')
@Unique(['patient', 'doctorTimeSlot']) // one appointment per patient per slot
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { eager: true })
  patient: Patient;

  @ManyToOne(() => DoctorTimeSlot, (slot) => slot.appointments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  doctorTimeSlot: DoctorTimeSlot;

  @CreateDateColumn()
  created_at: Date;
}
