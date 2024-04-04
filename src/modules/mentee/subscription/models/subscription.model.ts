import { User } from '@modules/common/users/models/users.model';
import { Mentee } from '@modules/mentee/mentee_user/models/mentee.model';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subscription extends Document {
  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  menteeUser: User;

  @Prop({ type: 'ObjectId', ref: 'Mentee', required: true })
  mentee: Mentee;

  @Prop({ type: 'ObjectId', ref: 'Mentor', required: true })
  mentor: Mentor;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
