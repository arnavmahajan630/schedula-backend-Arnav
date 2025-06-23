import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserSigninDto, UserSignupDto } from './dto/user.dto';

interface JwtPayload {
  email: string;
  sub: number;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: UserSignupDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password_hash,
    });

    const savedUser = await this.userRepo.save(user);
    return {
      user_id: savedUser.user_id,
      email: savedUser.email,
      role: savedUser.role,
      message: 'Signup successful',
    };
  }

  async signin(dto: UserSigninDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.generateTokens(user);
    user.hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepo.save(user);

    return tokens;
  }

  async signout(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.userRepo.findOne({ where: { user_id: payload.sub } });
    if (!user) throw new UnauthorizedException('Invalid token');

    user.hashed_refresh_token = null;
    await this.userRepo.save(user);

    return { message: 'Signout successful' };
  }

  async refreshTokens(userId: number, refreshToken: string) {
  const user = await this.userRepo.findOne({ where: { user_id: userId } });
  if (!user || !user.hashed_refresh_token) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const isValid = await bcrypt.compare(refreshToken, user.hashed_refresh_token);
  if (!isValid) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const tokens = await this.generateTokens(user);
  user.hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 10);
  await this.userRepo.save(user);

  return tokens;
}


  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.user_id,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
