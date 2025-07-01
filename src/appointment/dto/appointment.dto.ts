import { Type } from 'class-transformer';
import { IsInt, IsString, IsDate, IsEnum } from 'class-validator';
import { Session, Weekday } from 'src/doctor/enums/availability.enums';

export class CreateAppointmentDto {
  @IsInt()
  doctor_id: number;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsEnum(Weekday)
  weekday: Weekday;

  @IsEnum(Session)
  session: Session;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;
}
