import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  doctor_id: number;

  @IsInt()
  @IsNotEmpty()
  timeslot_id: number;
}
