import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  async getProfile(userId: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor profile not found for user ID: ${userId}`);
    }

    return { message: 'Doctor Profile', data: doctor };
  }

  async listDoctors(search?: string) {
    let where: FindOptionsWhere<Doctor>[] | undefined = undefined;

    if (search) {
      where = [
        { clinic_name: ILike(`%${search}%`) },
        { specialization: ILike(`%${search}%`) },
        { user: { first_name: ILike(`%${search}%`) } },
      ];
    }

    const doctors = await this.doctorRepo.find({
      where,
      relations: ['user'],
    });

    return { count: doctors.length, data: doctors };
  }

  async getDoctorDetails(userId: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException(`No doctor found with user ID: ${userId}`);
    }

    return { data: doctor };
  }
}
