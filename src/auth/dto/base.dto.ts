import { UserRole } from '../enums/user.enums';
import { UserSignupDto } from './user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SignupDto extends UserSignupDto {
  // Doctor-specific fields - only validated when role is DOCTOR
  @ValidateIf((o: SignupDto) => o.role === UserRole.DOCTOR)
  @IsNotEmpty()
  @IsString()
  education?: string;

  @ValidateIf((o: SignupDto) => o.role === UserRole.DOCTOR)
  @IsNotEmpty()
  @IsString()
  specialization?: string;

  @ValidateIf((o: SignupDto) => o.role === UserRole.DOCTOR)
  @IsNotEmpty()
  @IsNumber()
  experience_years?: number;

  @ValidateIf((o: SignupDto) => o.role === UserRole.DOCTOR)
  @IsNotEmpty()
  @IsString()
  clinic_name?: string;

  @ValidateIf((o: SignupDto) => o.role === UserRole.DOCTOR)
  @IsNotEmpty()
  @IsString()
  clinic_address?: string;

  // Patient-specific fields - only validated when role is PATIENT
  @ValidateIf((o: SignupDto) => o.role === UserRole.PATIENT)
  @IsNotEmpty()
  @IsNumber()
  age?: number;

  @ValidateIf((o: SignupDto) => o.role === UserRole.PATIENT)
  @IsNotEmpty()
  @IsString()
  gender?: string;

  @ValidateIf((o: SignupDto) => o.role === UserRole.PATIENT)
  @IsNotEmpty()
  @IsString()
  address?: string;

  @ValidateIf((o: SignupDto) => o.role === UserRole.PATIENT)
  @IsNotEmpty()
  @IsString()
  emergency_contact?: string;

  @ValidateIf((o: SignupDto) => o.role === UserRole.PATIENT)
  @IsNotEmpty()
  @IsString()
  medical_history?: string;
}

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
