import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Entity('patients')
export class Patient {
  @PrimaryColumn()
  user_id: number;

  @OneToOne(() => User, (user) => user.patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column()
  emergency_contact: string;

  @Column()
  medical_history: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
