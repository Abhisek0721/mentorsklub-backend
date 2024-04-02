import { MentorshipField } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Mentee extends Document {
  @Prop({ type: 'ObjectId', ref: 'User', unique: true, required: true })
  userId: User;

  @Prop({ type: [String], default: [], required: true  })
  fieldOnInterests: MentorshipField[];

  @Prop({
    type: {
      latitude: Number,
      longitude: Number,
      roadName: String,
      city: String,
      state: String,
      pincode: String
    },
    default: {
      latitude: null,
      longitude: null,
      roadName: "",
      city: "",
      state: "",
      pincode: ""
    }
  })
  location: {
    latitude: number,
    longitude: number,
    roadName: string,
    city: string,
    state: string,
    pincode: string
  };
}

export const MenteeSchema = SchemaFactory.createForClass(Mentee);
