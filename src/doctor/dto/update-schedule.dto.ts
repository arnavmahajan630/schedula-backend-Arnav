import { IsEnum, IsString } from 'class-validator';
import { ScheduleType } from '../enums/schedule-type.enums';

export class UpdateScheduleDto {
  @IsString()
  @IsEnum(ScheduleType)
  schedule_type: ScheduleType;
}
