import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MenteeUsersModule } from './mentee_user/menteeUsers.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    MenteeUsersModule,
    RouterModule.register([
      {
        path: 'mentee',
        children: [
          {
            path: 'user',
            module: MenteeUsersModule,
          },
          {
            path: 'subscription',
            module: SubscriptionModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class MenteeModule {}
