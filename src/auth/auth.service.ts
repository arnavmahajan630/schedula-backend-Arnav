import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProvider, UserRole } from './enums/user.enums';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Doctor } from '../doctor/entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';
import { PatientSignupDto } from './dto/patient.dto';
import { DoctorSignupDto } from './dto/doctor.dto';
import { SigninDto, SignupDto } from './dto/base.dto';
import { googleUser } from './strategies/google.strategy';

export interface JwtPayload {
  email: string;
  sub: number;
  role: UserRole;
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
            user_id: savedUser.user_id,
            education: doctorSignupDto.education,
            specialization: doctorSignupDto.specialization,
            experience_years: doctorSignupDto.experience_years,
            clinic_name: doctorSignupDto.clinic_name,
            clinic_address: doctorSignupDto.clinic_address,
          });
          await manager.save(doctor);
        }

        if (savedUser.role === UserRole.PATIENT) {
          const patientSignupDto = signupDto as PatientSignupDto;
          const patient = manager.create(Patient, {
            user_id: savedUser.user_id,
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
      console.error('Signup error:', error);

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

      if (user.provider === UserProvider.GOOGLE) {
        throw new UnauthorizedException(
          'Account is registered via Google. Please login with Google.',
        );
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

  async signout(refreshToken: string) {
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
      // Invalidate the refresh token by removing it
      user.hashed_refresh_token = null;
      await this.userRepository.save(user);
      return { message: 'Sign out successful' };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
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
      if (!user || !user.hashed_refresh_token) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const isRefreshTokenValid = await this.verifyString(
        refreshToken,
        user.hashed_refresh_token,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const tokens = await this.generateTokens(user);
      user.hashed_refresh_token = await this.hashString(tokens.refreshToken);
      await this.userRepository.save(user);
      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to refresh tokens');
    }
  }

  async googleSignin(googleUser: googleUser) {
    try {
      let user = await this.userRepository.findOne({
        where: { email: googleUser.email },
      });

      if (!user) {
        // Create new user if not exists
        user = this.userRepository.create({
          email: googleUser.email,
          password_hash: '', // No password for Google users
          first_name: googleUser.firstName,
          last_name: googleUser.lastName,
          phone_number: '',
          role: googleUser.role,
          provider: UserProvider.GOOGLE,
        });

        await this.userRepository.save(user);

        // Create doctor or patient profile
        if (user.role === UserRole.DOCTOR) {
          const doctor = this.doctorRepository.create({
            user: user,
            education: '',
            specialization: '',
            experience_years: 0,
            clinic_name: '',
            clinic_address: '',
          });
          await this.doctorRepository.save(doctor);
        }
        if (user.role === UserRole.PATIENT) {
          const patient = this.patientRepository.create({
            user: user,
            age: 0,
            gender: '',
            address: '',
            emergency_contact: '',
            medical_history: '',
          });
          await this.patientRepository.save(patient);
        }
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);
      user.hashed_refresh_token = await this.hashString(tokens.refreshToken);
      await this.userRepository.save(user);

      return tokens;
    } catch (error) {
      console.error('Google login error:', error);
      throw new InternalServerErrorException(
        'Failed to authenticate with Google',
      );
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
