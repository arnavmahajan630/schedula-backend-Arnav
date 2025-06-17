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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',  // Your real password
      database: '', // the dbname
      entities: [Doctor, Patient, TimeSlot, Appointment],
      synchronize: true,

    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
