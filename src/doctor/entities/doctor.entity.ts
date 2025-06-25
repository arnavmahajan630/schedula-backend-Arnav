import {
  Entity,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { DoctorAvailability } from './doctor-availability.entity';
import { DoctorTimeSlot } from './doctor-time-slot.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryColumn()
  user_id: number;

  @Column()
  education: string;

  @Column()
  specialization: string;

  @Column()
  experience_years: number;

  @Column()
  clinic_name: string;

  @Column()
  clinic_address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => DoctorAvailability, (availability) => availability.doctor)
  availabilities: DoctorAvailability[];

  @OneToMany(() => DoctorTimeSlot, (slot) => slot.doctor)
  time_slots: DoctorTimeSlot[];
}
