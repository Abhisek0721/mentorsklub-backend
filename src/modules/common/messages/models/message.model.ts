import { User } from '@modules/common/users/models/users.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  sender: User;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  receiver: User;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Boolean, default: false })
  read: boolean;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: 'ObjectId', ref: 'Message' })
  replyTo?: Message;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
