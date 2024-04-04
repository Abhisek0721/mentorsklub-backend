import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/common/users/models/users.model';
import { DATABASE_NAME } from '@constants/index';
import { Mentor, MentorSchema } from '../mentor_user/models/mentor.model';
import { SessionMeet, SessionMeetSchema } from './models/sessionModel.model';
import { SessionMeetController } from './controllers/session.controller';
import { SessionMeetService } from './services/session.service';
import { ZoomService } from '@modules/zoom/services/zoom.services';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Mentor.name, schema: MentorSchema },
        { name: SessionMeet.name, schema: SessionMeetSchema },
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [SessionMeetController],
  providers: [SessionMeetService, ZoomService],
})
export class SessionModule {}
