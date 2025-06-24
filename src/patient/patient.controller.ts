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

@Controller('api/v1/patient')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as any;
    if (user.role !== 'patient') {
      throw new UnauthorizedException('Access denied: Not a patient');
    }
    return this.patientService.getProfile(user.id);
  }
}