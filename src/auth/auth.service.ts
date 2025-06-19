import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSigninDto, UserSignupDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(userSignupDto: UserSignupDto) {
    try {
      const alredyExists = await this.userRepository.findOne({
        where: { email: userSignupDto.email },
      });
      if (alredyExists) {
        throw new ConflictException(
          'Email already in use. Please use a different email.',
        );
      }
      const hashed_password = await this.hashString(userSignupDto.password);

      const newUser = this.userRepository.create({
        first_name: userSignupDto.first_name,
        last_name: userSignupDto.last_name,
        email: userSignupDto.email,
        password_hash: hashed_password,
        phone_number: userSignupDto.phone_number,
        hashed_refresh_token: null,
      });

      const savedUser = await this.userRepository.save(newUser);
      savedUser.password_hash = '';

      return savedUser;
    } catch {
      throw new ConflictException(
        'Email already in use. Please use a different email.',
      );
    }
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
    const payload = { email: user.email, id: user.user_id };

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
