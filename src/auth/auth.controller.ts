import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignupDto } from './dto/user.dto';
import { PatientSignupDto } from './dto/Patient.dto';
import { DoctorSignupDto } from './dto/Doctor.dto';
import { UserSigninDto } from './dto/user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() userSignupDto: UserSignupDto,
  @Body() doctorDto?: DoctorSignupDto,
  @Body() patientDto?: PatientSignupDto,) {
    return this.authService.signup(userSignupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() userSigninDto: UserSigninDto) {
    return this.authService.signin(userSigninDto);
  }
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
