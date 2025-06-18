import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  doctor_id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password_hash: string;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'varchar' })
  specialization: string;

  @Column({ type: 'int', default: 0 })
  experience_years: number;

  @Column({ type: 'varchar' })
  education: string;

  @Column({ type: 'varchar' })
  clinic_name: string;

  @Column({ type: 'varchar' })
  clinic_address: string;

  @Column({ type: 'simple-array' })
  available_days: string[];

  @Column({ type: 'simple-array' })
  available_time_slots: string[];

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'hashed_refresh_token',
  })
  hashed_refresh_token: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
