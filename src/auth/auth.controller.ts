import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSigninDto, UserSignupDto } from './dto/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: UserSignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: UserSigninDto) {
    return this.authService.signin(dto);
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
async refresh(@Body('user_id') userId: number, @Body('refresh_token') refreshToken: string) {
  return this.authService.refreshTokens(userId, refreshToken);
}


  @Get('doctor/profile')
  @UseGuards(JwtAuthGuard)
  async doctorProfile(@Req() req) {
    if (req.user.role !== 'doctor') {
      return { message: 'Access denied' };
    }
    return { message: 'Welcome Doctor', user: req.user };
  }

  @Get('patient/profile')
  @UseGuards(JwtAuthGuard)
  async patientProfile(@Req() req) {
    if (req.user.role !== 'patient') {
      return { message: 'Access denied' };
    }
    return { message: 'Welcome Patient', user: req.user };
  }
}
