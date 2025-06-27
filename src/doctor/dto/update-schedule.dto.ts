import { IsEnum, IsString } from 'class-validator';
import { ScheduleType } from '../enums/schedule-type.enums';


export class UpdateScheduleDto {
  @IsString({ message: 'schedule_Type must be a string' })
  @IsEnum(ScheduleType, {
    message: 'schedule_Type must be either "stream" or "wave"',
  })
  schedule_Type: ScheduleType;
}

