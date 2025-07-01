import { IsInt, IsDateString, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  doctor_id: number;

  @IsDateString()
  date: string;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;
}
