import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserSignupDto } from './user.dto';

export class DoctorSignupDto extends UserSignupDto {
  @IsNotEmpty()
  @IsString()
  education: string;

  @IsNotEmpty()
  @IsString()
  specialization: string;

  @IsNotEmpty()
  @IsNumber()
  experience_years: number;

  @IsNotEmpty()
  @IsString()
  clinic_name: string;

  @IsNotEmpty()
  @IsString()
  clinic_address: string;
}
