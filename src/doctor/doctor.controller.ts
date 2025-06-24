import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { DoctorService } from './doctor.service';

@Controller('api/v1/doctor')
@UseGuards(JwtAuthGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as any;
    if (user.role !== 'doctor') {
      throw new ForbiddenException('Access denied: Not a doctor');
    }
    return this.doctorService.getProfile(user.id);
  }

  @Get('list')
  async listDoctors(@Query('search') search: string) {
    return this.doctorService.listDoctors(search);
  }

  @Get(':id')
  async getDoctorDetails(@Param('id') id: string) {
    return this.doctorService.getDoctorDetails(Number(id));
  }
}