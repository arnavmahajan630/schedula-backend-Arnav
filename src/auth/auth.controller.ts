import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DoctorSigninDto, DoctorSignupDto } from './dto/doctor.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() doctorSignupDto: DoctorSignupDto) {
    return this.authService.signup(doctorSignupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() doctorSigninDto: DoctorSigninDto) {
    return this.authService.signin(doctorSigninDto);
  }
  @Post('refresh')
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
