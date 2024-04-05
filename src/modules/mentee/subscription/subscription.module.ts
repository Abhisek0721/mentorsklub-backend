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
import { SessionMeet, SessionMeetSchema } from '@modules/mentor/session/models/sessionModel.model';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionService } from './services/subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Mentee.name, schema: MenteeSchema },
        { name: Mentor.name, schema: MentorSchema },
        { name: Subscription.name, schema: SubscriptionSchema },
        { name: SessionMeet.name, schema: SessionMeetSchema },
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
