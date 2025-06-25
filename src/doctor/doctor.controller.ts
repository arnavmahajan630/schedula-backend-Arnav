import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { DoctorService } from './doctor.service';
import { CreateDoctorAvailabilityDto } from './dto/create-availabilty.dto';
import { JwtPayload } from 'src/auth/auth.service';

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

   @Post(':id/availability')
  async setAvailability(
    @Param('id') id: number,
    @Body() dto: CreateDoctorAvailabilityDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
     if(user.role == 'doctor') {
      return this.doctorService.createAvailability(id, dto);
     }
      throw new ForbiddenException('Access denied: Not a doctor');
    
  }

   @Get(':id/availability')
  async getAvailability(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.doctorService.getAvailableTimeSlots(id, page, limit);
  }

}
