import { MentorshipField } from '@constants/index';
import { IsArray, IsEnum, IsNumber, IsObject, IsString } from 'class-validator';
import { SocialHandelsType } from '../types/socialHandels.type';

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

export class MentorProfileDTO {
  @IsNumber()
  yearsOfExperience: number;

  @IsArray()
  skills: string[];

  @IsArray()
  languages: string[];

  @IsObject()
  socialHandels: SocialHandelsType;

  @IsString()
  profileTitle: string;

  @IsString()
  profileDescription: string;
}
