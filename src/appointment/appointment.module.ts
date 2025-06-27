import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DoctorTimeSlot } from 'src/doctor/entities/doctor-time-slot.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, DoctorTimeSlot, Patient])],
})
export class AppointmentModule {}
