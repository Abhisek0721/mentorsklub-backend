import { MentorshipField } from '@constants/index';
import { IsEnum, IsNumber, IsObject, IsString } from 'class-validator';

class TimeDTO {
    @IsNumber()
    hours: number;

    @IsNumber()
    minute: number;
}

export class AvailabilityTimeDTO {
    @IsObject()
    startTime: TimeDTO;

    @IsObject()
    endTime: TimeDTO;
}

export class MentorDTO {
  @IsString()
  teaches: string;

  @IsEnum(MentorshipField)
  field: MentorshipField;

  @IsObject()
  availabilityTime: AvailabilityTimeDTO;
}
