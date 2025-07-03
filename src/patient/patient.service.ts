import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const patient = await this.patientRepo.findOne({
        where: { user_id: userId },
        relations: ['user'],
      });

      if (!patient) {
        throw new NotFoundException(
          `Patient profile not found for user ID: ${userId}`,
        );
      }
      const patientWithProfile = {
        ...patient,
        user: {
          user: patient.user.profile,
        },
      };

      return { message: 'Patient Profile', data: patientWithProfile };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching patient profile');
    }
  }
}
