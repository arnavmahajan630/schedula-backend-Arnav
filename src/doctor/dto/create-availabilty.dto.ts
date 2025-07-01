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
