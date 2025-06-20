import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class DoctorSignupDto {
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

  @IsNotEmpty()
  @IsString()
  available_days: string;  // or string[] if you want array

  @IsNotEmpty()
  @IsString()
  available_time_slots: string; // or string[] if you want array
}
