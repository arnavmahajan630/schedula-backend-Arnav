import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PatientService } from './patient.service';

@Module({
  controllers: [PatientController],
  providers: [JwtStrategy, PatientService],
})
export class PatientModule {}