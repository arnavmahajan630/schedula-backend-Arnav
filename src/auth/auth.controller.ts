import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/base.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { googleUser } from './strategies/google.strategy';
import { UserRole } from './enums/user.enums';
import { GoogleAuthGuard } from './guards/google.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Headers('authorization') authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const refreshToken = authHeader.split(' ')[1];
    return this.authService.signout(refreshToken);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Get('google')
  googleAuth(@Query('role') role: string, @Res() res: Response) {
    const validRole = role === 'doctor' ? UserRole.DOCTOR : UserRole.PATIENT;
    return res.redirect(`/api/v1/auth/google/login?state=${validRole}`);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<void> {
    // This route is handled by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  async googleCallback(@Req() req: Request) {
    const tokens = await this.authService.googleSignin(req.user as googleUser);
    return tokens;
  }
}
