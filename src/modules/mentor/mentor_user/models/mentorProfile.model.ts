import { User } from '@modules/common/users/models/users.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SocialHandelsType } from '../types/socialHandels.type';
import { Mentor } from './mentor.model';

@Schema({ timestamps: true })
export class MentorProfile extends Document {
  @Prop({ type: 'ObjectId', ref: 'User', unique: true, required: true })
  user: User;

  @Prop({ type: 'ObjectId', ref: 'Mentor', unique: true, required: true })
  mentor: Mentor;

  @Prop({ type: Number, default: null })
  yearsOfExperience: number;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop({
    type: {
      personalPortfolioUrl: String,
      linkedinUrl: String,
      instagramUrl: String,
      otherUrl: String,
    },
    default: {
      personalPortfolioUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
      otherUrl: '',
    },
  })
  socialHandels: SocialHandelsType;

  @Prop({ type: String, default: '' })
  profileTitle: string;

  @Prop({ type: String, default: '' })
  profileDescription: string;
}

export const MentorProfileSchema = SchemaFactory.createForClass(MentorProfile);
