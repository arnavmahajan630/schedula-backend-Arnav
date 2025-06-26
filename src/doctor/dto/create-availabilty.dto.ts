import { IsDateString, IsString, IsEnum, IsArray, ArrayNotEmpty } from 'class-validator';
import { Session, Weekday } from '../enums/availability.enums';

export class CreateDoctorAvailabilityDto {
  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsEnum(Session)
  session: Session;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Weekday, { each: true })
  weekdays: Weekday[];
}