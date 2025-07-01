import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DoctorTimeSlot } from 'src/doctor/entities/doctor-time-slot.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, DoctorTimeSlot, Patient])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
