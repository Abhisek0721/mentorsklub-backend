import { Module } from '@nestjs/common';
import { MentorUserController } from './controllers/mentorUser.controller';
import { MentorUserService } from './services/mentorUser.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/common/users/models/users.model';
import { DATABASE_NAME } from '@constants/index';
import { Mentor, MentorSchema } from './models/mentor.model';
import { MentorProfile, MentorProfileSchema } from './models/mentorProfile.model';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Mentor.name, schema: MentorSchema },
        { name: MentorProfile.name, schema: MentorProfileSchema },
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [MentorUserController],
  providers: [MentorUserService],
})
export class MentorUsersModule {}
