import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MenteeUsersModule } from './mentee_user/menteeUsers.module';


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
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class MenteeModule {}
