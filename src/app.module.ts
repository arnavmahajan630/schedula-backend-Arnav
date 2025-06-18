import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/database.config';

import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { TimeSlotModule } from './timeslot/timeslot.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AvailabilityModule } from './availability/availability.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: typeOrmConfig }),
    UserModule,
    DoctorModule,
    PatientModule,
    TimeSlotModule,
    AppointmentModule,
    AvailabilityModule,
  ],
})
export class AppModule {}
