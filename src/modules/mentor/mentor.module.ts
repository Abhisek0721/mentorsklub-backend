import { Module } from '@nestjs/common';
import { MentorUsersModule } from './mentor_user/mentorUsers.module';
import { RouterModule } from '@nestjs/core';
import { SessionModule } from './session/session.module';
import { MentorSubscriptionModule } from './mentor_subscription/mentorSubscription.module';

@Module({
  imports: [
    MentorUsersModule,
    SessionModule,
    MentorSubscriptionModule,
    RouterModule.register([
      {
        path: 'mentor',
        children: [
          {
            path: 'user',
            module: MentorUsersModule,
          },
          {
            path: 'session',
            module: SessionModule,
          },
          {
            path: 'subscription',
            module: MentorSubscriptionModule
          }
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class MentorModule {}
