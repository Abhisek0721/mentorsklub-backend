import { Module } from '@nestjs/common';
import { MenteeUserController } from '@modules/mentee/mentee_user/controllers/menteeUser.controller';
import { MenteeUserService } from '@modules/mentee/mentee_user/services/menteeUser.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/common/users/models/users.model';
import { DATABASE_NAME } from '@constants/index';
import { Mentee, MenteeSchema } from './models/mentee.model';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Mentee.name, schema: MenteeSchema },
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [MenteeUserController],
  providers: [MenteeUserService],
  exports: [MenteeUserService],
})
export class MenteeUsersModule {}
