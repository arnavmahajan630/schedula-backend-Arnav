import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Doctor, Patient]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
