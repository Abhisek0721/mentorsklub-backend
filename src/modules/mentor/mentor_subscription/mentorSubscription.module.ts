import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_NAME } from '@constants/index';
import {
  Mentor,
  MentorSchema,
} from '@modules/mentor/mentor_user/models/mentor.model';
import { Mentee, MenteeSchema } from '@modules/mentee/mentee_user/models/mentee.model';
import { Subscription } from 'rxjs';
import { SubscriptionSchema } from '@modules/mentee/subscription/models/subscription.model';
import { MentorSubscriptionController } from './controllers/mentorSubscription.controller';
import { MentorSubscriptionService } from './services/mentorSubscription.service';


@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Mentee.name, schema: MenteeSchema },
        { name: Mentor.name, schema: MentorSchema },
        { name: Subscription.name, schema: SubscriptionSchema }
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [MentorSubscriptionController],
  providers: [MentorSubscriptionService],
})
export class MentorSubscriptionModule {}
