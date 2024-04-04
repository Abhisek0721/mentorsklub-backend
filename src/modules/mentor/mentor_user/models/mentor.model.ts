import { MentorshipField } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ZoomTokenType } from '../types/zoomTokensType';

@Schema({ timestamps: true })
export class Mentor extends Document {
  @Prop({ type: 'ObjectId', ref: 'User', unique: true, required: true })
  user: User;

  @Prop({
    type: String,
    enum: MentorshipField,
    default: MentorshipField.Other,
    required: true,
  })
  field: MentorshipField;

  @Prop({ type: String, default: '' })
  teaches: String;

  @Prop({
    type: {
      startTime: {
        hours: Number,
        minute: Number,
      },
      endTime: {
        hours: Number,
        minute: Number,
      },
    },
    default: {
      startTime: {
        hours: null,
        minute: null,
      },
      endTime: {
        hours: null,
        minute: null,
      },
    },
  })
  availabilityTime: {
    startTime: {
      hours: number;
      minute: number;
    };
    endTime: {
      hours: number;
      minute: number;
    };
  };

  @Prop({
    type: {
      accessToken: String,
      refreshToken: String,
      tokenExpiresAt: Date
    },
    default: {
      accessToken: '',
      refreshToken: '',
      tokenExpiresAt: null
    },
  })
  zoomTokens: ZoomTokenType;
}

export const MentorSchema = SchemaFactory.createForClass(Mentor);
