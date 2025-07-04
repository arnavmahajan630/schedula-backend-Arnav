import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/appointment.dto';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRole } from 'src/auth/enums/user.enums';

@Controller('api/v1/appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}
  @Post('create')
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    if (user.role !== UserRole.PATIENT) {
      throw new UnauthorizedException('Only patients can create appointments');
    }
    const patientId = user.sub;
    return this.appointmentService.createAppointment(
      patientId,
      createAppointmentDto,
    );
  }

  @Get('view')
  async viewAppointments(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.appointmentService.viewAppointments(user.sub, user.role);
  }
}
