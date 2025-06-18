import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DoctorDetails } from '../entities/doctor.entity';
import { PatientDetails } from '../entities/patient.entity';
import { TimeSlot } from '../entities/timeslot.entity';
import { Appointment } from '../entities/appointment.entity';
import { Availability } from '../entities/availability.entity';

export const typeOrmConfig = async (): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Admin@07',
  database: 'DoctorBookingSystem',
  entities: [User, DoctorDetails, PatientDetails, TimeSlot, Appointment, Availability],
  synchronize: true,
});