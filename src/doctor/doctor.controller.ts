import { Controller, Get, Param, Query, UseGuards, Req, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Doctor } from '../auth/entities/doctor.entity';
import { FindOptionsWhere } from 'typeorm';

@Controller('api/v1/doctor')
@UseGuards(JwtAuthGuard)
export class DoctorController {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as any;
    if (user.role !== 'doctor') {
      throw new ForbiddenException('Access denied: Not a doctor');
    }

    const doctor = await this.doctorRepo.findOne({
      where: { user_id: user.id },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor profile not found for user ID: ${user.id}`);
    }

    return { message: 'Doctor Profile', data: doctor };
  }

  @Get('list')
async listDoctors(@Query('search') search: string) {
  let where: FindOptionsWhere<Doctor>[] | undefined = undefined;

  if (search) {
    where = [
      { clinic_name: ILike(`%${search}%`) },
      { specialization: ILike(`%${search}%`) },
    ];
  }

  const doctors = await this.doctorRepo.find({
    where,
    relations: ['user'],
  });

  return { count: doctors.length, data: doctors };
}

  @Get(':id')
  async getDoctorDetails(@Param('id') id: string) {
    const doctor = await this.doctorRepo.findOne({
      where: { user_id: Number(id) },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException(`No doctor found with user ID: ${id}`);
    }

    return { data: doctor };
  }
}
