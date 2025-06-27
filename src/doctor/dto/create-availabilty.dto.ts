import {
  IsDateString,
  IsString,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Session, Weekday } from '../enums/availability.enums';
import { Transform } from 'class-transformer';

export class CreateDoctorAvailabilityDto {
  @IsDateString()
  @Transform(({ value }) => new Date(value as string))
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
