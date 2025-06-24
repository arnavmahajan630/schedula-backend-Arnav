import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  controllers: [PatientController],
  providers: [JwtStrategy],
})
export class PatientModule {}