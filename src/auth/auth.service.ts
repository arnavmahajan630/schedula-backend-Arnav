import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole, UserSigninDto, UserSignupDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { DoctorSignupDto } from './dto/Doctor.dto';
import { PatientSignupDto } from './dto/Patient.dto';

interface JwtPayload {
  email: string;
  sub: number;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private jwtService: JwtService,
  ) {}

  async signup(
  userSignupDto: UserSignupDto,
  doctorDto?: DoctorSignupDto,
  patientDto?: PatientSignupDto,
) {
  const exists = await this.userRepository.findOne({
    where: { email: userSignupDto.email },
  });
  if (exists) throw new ConflictException('Email already in use');

  const hashedPassword = await this.hashString(userSignupDto.password);

  const userData: any = {
    ...userSignupDto,
    password_hash: hashedPassword,
    hashed_refresh_token: null,
  };

  if (userSignupDto.role === 'doctor' && doctorDto) {
    userData.education = doctorDto.education;
    userData.specialization = doctorDto.specialization;
    userData.experience_years = doctorDto.experience_years;
    userData.clinic_name = doctorDto.clinic_name;
    userData.clinic_address = doctorDto.clinic_address;
    userData.available_days = doctorDto.available_days;
    userData.available_time_slots = doctorDto.available_time_slots;
  }

  if (userSignupDto.role === 'patient' && patientDto) {
    userData.age = patientDto.age;
    userData.gender = patientDto.gender;
    userData.address = patientDto.address;
    userData.emergency_contact = patientDto.emergency_contact;
    userData.medical_history = patientDto.medical_history;
  }

  const user = this.userRepository.create(userData);
  return await this.userRepository.save(user);
}


  async signin(userSigninDto: UserSigninDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userSigninDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await this.verifyString(
        userSigninDto.password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const tokens = await this.generateTokens(user);

      user.hashed_refresh_token = await this.hashString(tokens.refreshToken);
      await this.userRepository.save(user);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      const user = await this.userRepository.findOne({
        where: { user_id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const isRefreshTokenValid = await this.verifyString(
        refreshToken,
        user.hashed_refresh_token || '',
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const tokens = await this.generateTokens(user);
      user.hashed_refresh_token = await this.hashString(tokens.refreshToken);
      await this.userRepository.save(user);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

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

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.user_id,
      role: user.role,
    };

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
