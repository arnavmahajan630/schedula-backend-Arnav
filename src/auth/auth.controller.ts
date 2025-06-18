import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DoctorSignupDto } from './dto/doctor.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() doctorSignupDto: DoctorSignupDto) {
    return this.authService.signup(doctorSignupDto);
  }
}
