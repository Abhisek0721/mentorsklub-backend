import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RouterModule.register([
      {
        path: 'mentor',
        children: [
          {
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'users',
            module: UsersModule,
          }
        ],
      }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class MentorModule {}
