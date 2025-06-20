import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PatientSignupDto {
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  emergency_contact: string;

  @IsNotEmpty()
  @IsString()
  medical_history: string;
}