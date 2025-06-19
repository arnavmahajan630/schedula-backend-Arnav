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

  async signup(userSignupDto: UserSignupDto) {
    return await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          // Check if user already exists
          const alreadyExists = await transactionalEntityManager.findOne(User, {
            where: { email: userSignupDto.email },
          });

          if (alreadyExists) {
            throw new ConflictException(
              'Email already in use. Please use a different email.',
            );
          }

          const hashed_password = await this.hashString(userSignupDto.password);

          const newUser = transactionalEntityManager.create(User, {
            first_name: userSignupDto.first_name,
            last_name: userSignupDto.last_name,
            email: userSignupDto.email,
            password_hash: hashed_password,
            phone_number: userSignupDto.phone_number,
            role: userSignupDto.role,
            hashed_refresh_token: null,
          });

          const savedUser = await transactionalEntityManager.save(newUser);

          if (userSignupDto.role === UserRole.DOCTOR) {
            const newDoctor = transactionalEntityManager.create(Doctor, {
              user: savedUser,
              education: userSignupDto.education,
              specialization: userSignupDto.specialization,
              experience_years: userSignupDto.experience_years,
              clinic_name: userSignupDto.clinic_name,
              clinic_address: userSignupDto.clinic_address,
              available_days: userSignupDto.available_days,
              available_time_slots: userSignupDto.available_time_slots,
            });
            await transactionalEntityManager.save(newDoctor);
          } else if (userSignupDto.role === UserRole.PATIENT) {
            const newPatient = transactionalEntityManager.create(Patient, {
              user: savedUser,
              age: userSignupDto.age,
              gender: userSignupDto.gender,
              emergency_contact: userSignupDto.emergency_contact,
              address: userSignupDto.address,
              medical_history: userSignupDto.medical_history,
            });
            await transactionalEntityManager.save(newPatient);
          }

          const { password_hash, hashed_refresh_token, ...userResponse } =
            savedUser;
          return userResponse;
        } catch (error) {
          if (error instanceof ConflictException) {
            throw error;
          }
          throw new ForbiddenException(
            `Invalid fields for ${userSignupDto.role}`,
          );
        }
      },
    );
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
