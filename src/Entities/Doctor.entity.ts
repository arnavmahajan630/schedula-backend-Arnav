import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { TimeSlot } from './TimeSlot';
import { Appointment } from './Appointment';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.doctorProfile)
  @JoinColumn()
  user: User;

  @Column()
  specialization: string;

  @Column()
  experience: number;

  @Column('text', { array: true })
  qualifications: string[];

  @OneToMany(() => TimeSlot, (slot) => slot.doctor)
  timeSlots: TimeSlot[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
