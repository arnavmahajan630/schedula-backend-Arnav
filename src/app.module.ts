import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloWorldModule } from './Hello-World/hello-world.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Doctor } from './Entities/doctor.entity';
import { Appointment } from './Entities/appointment.entity';
import { Patient } from './Entities/patient.entity';
import { TimeSlot } from './Entities/timeslot.entity';

@Module({
  imports: [
    HelloWorldModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Doctor, Patient, TimeSlot, Appointment],
      synchronize: true, // for dev usecase only!

    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
