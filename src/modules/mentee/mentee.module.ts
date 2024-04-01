import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
// import { AuthModule } from './auth/auth.module';
import { MenteeUsersModule } from './mentee_user/menteeUsers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './mentee_user/models/users.model';
import { DATABASE_NAME } from '@constants/index';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      DATABASE_NAME,
    ),
    // AuthModule,
    MenteeUsersModule,
    RouterModule.register([
      {
        path: 'mentee',
        children: [
          // {
          //   path: "auth",
          //   module: AuthModule
          // },
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
