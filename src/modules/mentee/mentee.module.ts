import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MenteeUsersModule } from './mentee_user/menteeUsers.module';


@Module({
  imports: [
    AuthModule,
    MenteeUsersModule,
    RouterModule.register([
      {
        path: 'mentee',
        children: [
          {
            path: "auth",
            module: AuthModule
          },
          {
            path: 'users',
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
