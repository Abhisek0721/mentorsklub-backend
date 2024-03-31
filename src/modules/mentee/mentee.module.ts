import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    AuthModule,
    UsersModule,
    RouterModule.register([
      {
        path: 'mentee',
        children: [
          {
            path: "auth",
            module: AuthModule
          }, 
          {
            path: "users",
            module: UsersModule
          }
        ]
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class MenteeModule {}
