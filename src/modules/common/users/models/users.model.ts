// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { ROLES } from 'src/constants';

// @Schema()
// export class User extends Document {
//   @Prop({ type: String, default: null })
//   firstName: string;

//   @Prop({ type: String, default: null })
//   lastName: string;

//   @Prop({ type: String })
//   email: string;

//   @Prop({ type: String })
//   password: string;

//   @Prop({ enum: ROLES })
//   role: ROLES;

//   @Prop({ type: String, default: null })
//   profileImage: string;

//   @Prop({ type: String, default: null })
//   phoneNumber: string;

//   @Prop({ type: Boolean, default: false })
//   isVerified: boolean;
// }

// export const UserSchema = SchemaFactory.createForClass(User);
