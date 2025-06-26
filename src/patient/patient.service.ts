import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async getProfile(userId: number) {
    const patient = await this.patientRepo.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!patient) {
      throw new NotFoundException(
        `Patient profile not found for user ID: ${userId}`,
      );
    }
    const patientWithoutCredentials = {
      ...patient,
      user: {
        ...patient.user,
        password_hash: undefined,
        hashed_refresh_token: undefined,
      },
    };

    return { message: 'Patient Profile', data: patientWithoutCredentials };
  }
}
