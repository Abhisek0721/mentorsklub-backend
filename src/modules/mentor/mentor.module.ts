import { Module } from '@nestjs/common';
import { MentorUsersModule } from './mentor_user/mentorUsers.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    MentorUsersModule,
    RouterModule.register([
      {
        path: 'mentor',
        children: [
          {
            path: 'users',
            module: MentorUsersModule,
          }
        ],
      }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class MentorModule {}
