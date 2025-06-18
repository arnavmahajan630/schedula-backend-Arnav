import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorSignupDto } from './dto/doctor.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
  ) {}
  async signup(doctorSignupDto: DoctorSignupDto) {
    const alredyExists = await this.doctorRepository.findOne({
      where: { email: doctorSignupDto.email },
    });
    if (alredyExists) {
      throw new ConflictException(
        'Email already in use. Please use a different email.',
      );
    }
    const hashed_password = await this.hashpassword(doctorSignupDto.password);

    const newDoctor = this.doctorRepository.create({
      first_name: doctorSignupDto.first_name,
      last_name: doctorSignupDto.last_name,
      email: doctorSignupDto.email,
      password_hash: hashed_password,
      phone_number: doctorSignupDto.phone_number,
      education: doctorSignupDto.education,
      experience_years: doctorSignupDto.experience_years,
      specialization: doctorSignupDto.specialization,
      clinic_name: doctorSignupDto.clinic_name,
      clinic_address: doctorSignupDto.clinic_address,
      available_days: doctorSignupDto.available_days,
      available_time_slots: doctorSignupDto.available_time_slots,
    });

    const savedDoctor = await this.doctorRepository.save(newDoctor);
    savedDoctor.password_hash = '';

    return savedDoctor;
  }

  private async hashpassword(password: string): Promise<string> {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  }
}
