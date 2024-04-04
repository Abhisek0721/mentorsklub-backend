import { Module } from '@nestjs/common';
import { ZoomController } from './controllers/zoom.controller';
import { ZoomService } from './services/zoom.services';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/common/users/models/users.model';
import {
  Mentor,
  MentorSchema,
} from '@modules/mentor/mentor_user/models/mentor.model';
import {
  Mentee,
  MenteeSchema,
} from '@modules/mentee/mentee_user/models/mentee.model';
import { DATABASE_NAME } from '@constants/index';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Mentor.name, schema: MentorSchema },
        { name: Mentee.name, schema: MenteeSchema },
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [ZoomController],
  providers: [ZoomService],
})
export class ZoomModule {}
