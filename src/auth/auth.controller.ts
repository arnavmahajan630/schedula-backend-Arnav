import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/base.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { googleUser } from './strategies/google.strategy';
import { UserRole } from './dto/user.dto';

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

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Get('google')
  googleAuth(@Query('role') role: string, @Res() res: Response) {
    const validRole = role === 'doctor' ? UserRole.DOCTOR : UserRole.PATIENT;
    const state = Buffer.from(JSON.stringify({ validRole })).toString(
      'base64url',
    ); // Encode role in state
    return res.redirect(`/api/v1/auth/google/login?state=${state}`);
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
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
