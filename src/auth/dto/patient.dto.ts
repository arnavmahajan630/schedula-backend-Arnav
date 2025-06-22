import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { UserSignupDto } from './user.dto';

export class PatientSignupDto extends UserSignupDto {
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
