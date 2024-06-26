import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/users.model';
import { Mentor, MentorSchema } from '@modules/mentor/mentor_user/models/mentor.model';
import { DATABASE_NAME } from '@constants/index';
import { UserController } from './controllers/user.controller';
import { MentorProfile, MentorProfileSchema } from '@modules/mentor/mentor_user/models/mentorProfile.model';


@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Mentor.name, schema: MentorSchema },
        { name: MentorProfile.name, schema: MentorProfileSchema }
      ],
      DATABASE_NAME
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
  // exports: [UserService]
})
export class UserModule {}
