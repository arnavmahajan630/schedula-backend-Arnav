import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('api/v1/patient')
@UseGuards(JwtAuthGuard)
export class PatientController {
  @Get('profile')
  getProfile(@Req() req: Request) {
    const user = req.user as any;
    if (user.role !== 'patient') {
      throw new UnauthorizedException('Access denied: Not a patient');
    }
    return { message: 'Patient Profile', user };
  }
}
