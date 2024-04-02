import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from 'src/constants';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true  })
  fullName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true  })
  password: string;

  @Prop({ enum: ROLES })
  role: ROLES;

  @Prop({ type: String, default: null })
  profileImageKey: string;

  @Prop({ type: String, default: null })
  phoneNumber: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

