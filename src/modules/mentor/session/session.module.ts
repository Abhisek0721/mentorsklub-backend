import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/common/users/models/users.model';
import { DATABASE_NAME } from '@constants/index';
import { Mentor, MentorSchema } from '../mentor_user/models/mentor.model';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Mentor.name, schema: MentorSchema },
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [],
  providers: [],
})
export class SessionModule {}
