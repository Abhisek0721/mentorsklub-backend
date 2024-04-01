import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from 'src/constants';

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true  })
  fullName: string;

  @Prop({ type: String, required: true  })
  email: string;

  @Prop({ type: String, required: true  })
  password: string;

  @Prop({ enum: ROLES })
  role: ROLES;

  @Prop({ type: String, default: null })
  profileImage: string;

  @Prop({ type: String, default: null })
  phoneNumber: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
