import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './dto/user.dto';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { PatientSignupDto } from './dto/patient.dto';
import { DoctorSignupDto } from './dto/doctor.dto';
import { SigninDto, SignupDto } from './dto/base.dto';

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
    private dataSource: DataSource,
  ) {}

  async signup(signupDto: SignupDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // Check if email already exists
        const emailExists = await manager.findOne(User, {
          where: { email: signupDto.email },
        });

        if (emailExists) {
          throw new ConflictException('Email already in use');
        }

        const hashed_password = await this.hashString(signupDto.password);

        // Save base user
        const user = manager.create(User, {
          email: signupDto.email,
          password_hash: hashed_password,
          first_name: signupDto.first_name,
          last_name: signupDto.last_name,
          phone_number: signupDto.phone_number,
          role: signupDto.role,
        });

        const savedUser = await manager.save(user);

        // Save doctor or patient profile
        if (savedUser.role === UserRole.DOCTOR) {
          const doctorSignupDto = signupDto as DoctorSignupDto;
          const doctor = manager.create(Doctor, {
            user: savedUser,
            education: doctorSignupDto.education,
            specialization: doctorSignupDto.specialization,
            experience_years: doctorSignupDto.experience_years,
            clinic_name: doctorSignupDto.clinic_name,
            clinic_address: doctorSignupDto.clinic_address,
            available_days: doctorSignupDto.available_days,
            available_time_slots: doctorSignupDto.available_time_slots,
          });
          await manager.save(doctor);
        }

        if (savedUser.role === UserRole.PATIENT) {
          const patientSignupDto = signupDto as PatientSignupDto;
          const patient = manager.create(Patient, {
            user: savedUser,
            age: patientSignupDto.age,
            gender: patientSignupDto.gender,
            address: patientSignupDto.address,
            emergency_contact: patientSignupDto.emergency_contact,
            medical_history: patientSignupDto.medical_history,
          });
          await manager.save(patient);
        }

        return {
          message: 'Signup successful',
          user_id: savedUser.user_id,
          role: savedUser.role,
        };
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create user account');
    }
  }

  async signin(signinDto: SigninDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: signinDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await this.verifyString(
        signinDto.password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const tokens = await this.generateTokens(user);

      user.hashed_refresh_token = await this.hashString(tokens.refreshToken);
      await this.userRepository.save(user);

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to sign in user');
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
