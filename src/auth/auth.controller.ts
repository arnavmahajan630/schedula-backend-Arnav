import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DoctorSigninDto, DoctorSignupDto } from './dto/doctor.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() doctorSignupDto: DoctorSignupDto) {
    return this.authService.signup(doctorSignupDto);
  }

  @Post('signin')
  async signin(@Body() doctorSigninDto: DoctorSigninDto) {
    return this.authService.signin(doctorSigninDto);
  }
}
