import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

export class UserSignupDto {
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
  @IsOptional()
  role: UserRole;

  // Additional fields for doctor
  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsNumber()
  experience_years?: number;

  @IsOptional()
  @IsString()
  clinic_name?: string;

  @IsOptional()
  @IsString()
  clinic_address?: string;

  @IsOptional()
  @IsString()
  available_days?: string;

  @IsOptional()
  @IsString()
  available_time_slots?: string;

  // Additional fields for patient
  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  emergency_contact?: string;

  @IsOptional()
  @IsString()
  medical_history?: string;
}

export class UserSigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
