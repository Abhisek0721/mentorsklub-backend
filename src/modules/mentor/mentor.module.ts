import { Module, Provider } from '@nestjs/common';
import { MentorUsersModule } from './mentor_user/mentorUsers.module';
import { RouterModule } from '@nestjs/core';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    MentorUsersModule,
    SessionModule,
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
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class MentorModule {}
