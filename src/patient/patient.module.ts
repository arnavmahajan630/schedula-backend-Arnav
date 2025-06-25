import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PatientService } from './patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientController],
  providers: [JwtStrategy, PatientService],
})
export class PatientModule {}
