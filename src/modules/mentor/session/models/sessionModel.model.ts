import { MeetingPlatform } from '@constants/meetingPlatform.enum';
import { User } from '@modules/common/users/models/users.model';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SessionMeet extends Document {
  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  mentorUser: User;

  @Prop({ type: 'ObjectId', ref: 'Mentor', required: true })
  mentor: Mentor;

  @Prop({ type: String, required: true })
  meetingTopic: string;

  @Prop({ type: String, enum: MeetingPlatform, default: MeetingPlatform.Zoom })
  meetingPlatform: MeetingPlatform;

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Number, default: 40})
  durationInMinute: number;

  @Prop({ type: String, required: true })
  meetingLink: string;
}

export const SessionMeetSchema = SchemaFactory.createForClass(SessionMeet);
