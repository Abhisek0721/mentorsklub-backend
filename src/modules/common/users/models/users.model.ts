import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import { Document } from 'mongoose';
import { MentorshipField, ROLES } from 'src/constants';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ enum: ROLES })
  role: ROLES;

  @Prop({ type: String, default: null })
  profileImageKey: string;

  @Prop({ type: String, default: null })
  phoneNumber: string;

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

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);


// Mongoose pre hook to create a Mentor document when a User document is created
UserSchema.pre('save', async function (this:User, next:NextFunction) {
  try {
    // if role is mentee, create mentee document
    if(this.role === ROLES.MENTEE) {
      const menteeModel = this.model("Mentee");
      const existingMentor = await menteeModel.exists({ user: this._id });
      if (existingMentor) {
        return next();
      }
      await menteeModel.create({ user: this._id });
      return next();
    }
    // else create mentor document
    const mentorModel = this.model("Mentor");
    const existingMentor = await mentorModel.exists({ user: this._id });
    if (existingMentor) {
      return next();
    }
    await mentorModel.create({ user: this._id, field: MentorshipField.Other });
    return next();
  } catch (error) {
    return next(error);
  }
});

