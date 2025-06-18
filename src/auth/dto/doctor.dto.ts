import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class DoctorSignupDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  specialization: string;

  @IsNotEmpty()
  @IsNumber()
  experience_years: number;

  @IsNotEmpty()
  @IsString()
  education: string;

  @IsNotEmpty()
  @IsString()
  clinic_name: string;

  @IsNotEmpty()
  @IsString()
  clinic_address: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  available_days: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  available_time_slots: string[];
}

export class DoctorSigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
