import { MentorshipField } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Mentor extends Document {
  @Prop({ type: 'ObjectId', ref: 'User', unique: true, required: true })
  userId: User;

  @Prop({ type: String, enum: MentorshipField, default: null, required: true })
  field: MentorshipField;

  @Prop({
    type: {
      latitude: Number,
      longitude: Number,
      roadName: String,
      city: String,
      state: String,
      pincode: String,
    },
    default: {
      latitude: null,
      longitude: null,
      roadName: '',
      city: '',
      state: '',
      pincode: '',
    },
  })
  location: {
    latitude: number;
    longitude: number;
    roadName: string;
    city: string;
    state: string;
    pincode: string;
  };

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

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const MentorSchema = SchemaFactory.createForClass(Mentor);
