import { Module } from '@nestjs/common';
import { MentorUsersModule } from './mentor_user/mentorUsers.module';
// import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    MentorUsersModule,
    // AuthModule,
    RouterModule.register([
      {
        path: 'mentor',
        children: [
          // {
          //   path: 'auth',
          //   module: AuthModule,
          // },
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
