import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class ZoomMeetDTO {
  @IsDateString()
  startTime: Date;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsString()
  meetingTopic: string;
}
