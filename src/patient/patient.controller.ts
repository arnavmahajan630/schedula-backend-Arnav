import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { PatientService } from './patient.service';
import { JwtPayload } from 'src/auth/auth.service';
import { UserRole } from 'src/auth/enums/user.enums';

@Controller('api/v1/patient')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as JwtPayload;
    if (user.role !== UserRole.PATIENT) {
      throw new UnauthorizedException('Access denied: Not a patient');
    }
    return this.patientService.getProfile(user.sub);
  }
}
