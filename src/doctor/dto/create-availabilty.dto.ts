import {
  IsString,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsDate,
} from 'class-validator';
import { Session, Weekday } from '../enums/availability.enums';
import { Type } from 'class-transformer';

export class CreateDoctorAvailabilityDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsEnum(Session)
  session: Session;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Weekday, { each: true })
  weekdays: Weekday[];
}
