import { User, UserSchema } from '@modules/common/users/models/users.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './models/subscription.model';
import { DATABASE_NAME } from '@constants/index';
import {
  Mentor,
  MentorSchema,
} from '@modules/mentor/mentor_user/models/mentor.model';
import { Mentee, MenteeSchema } from '../mentee_user/models/mentee.model';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Mentee.name, schema: MenteeSchema },
        { name: Mentor.name, schema: MentorSchema },
        { name: Subscription.name, schema: SubscriptionSchema }
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [],
  providers: [],
})
export class SubscriptionModule {}
