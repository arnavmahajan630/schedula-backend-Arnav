import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorSigninDto, DoctorSignupDto } from './dto/doctor.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private jwtService: JwtService,
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
    const hashed_password = await this.hashString(doctorSignupDto.password);

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

  async signin(doctorSigninDto: DoctorSigninDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { email: doctorSigninDto.email },
    });

    if (!doctor) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.verifyString(
      doctorSigninDto.password,
      doctor.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(doctor);

    doctor.hashed_refresh_token = await this.hashString(tokens.refreshToken);
    await this.doctorRepository.save(doctor);

    return tokens;
  }
  async refreshTokens(refreshToken: string) {}

  private async hashString(string: string): Promise<string> {
    const stringHash = await bcrypt.hash(string, 10);
    return stringHash;
  }
  private async verifyString(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  }

  private async generateTokens(doctor: Doctor): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = { email: doctor.email, id: doctor.doctor_id };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    return { accessToken, refreshToken };
  }
}
