import { DATABASE_NAME } from '@constants/index';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SessionMeet } from '../models/sessionModel.model';
import { ZoomService } from '@modules/zoom/services/zoom.services';
import { ZoomMeetDTO } from '../dto/zoomMeet.dto';

@Injectable()
export class SessionMeetService {
  constructor(
    private readonly zoomService: ZoomService,
    @InjectModel(Mentor.name, DATABASE_NAME) private mentorModel: Model<Mentor>,
    @InjectModel(SessionMeet.name, DATABASE_NAME)
    private sessionMeetModel: Model<SessionMeet>,
  ) {}

  async createZoomMeetLink(
    userId: string | Types.ObjectId,
    zoomMeetDto: ZoomMeetDTO,
  ):Promise<SessionMeet> {
    const createZoomMeet = await this.zoomService.createZoomMeetingLink(
      userId,
      zoomMeetDto.meetingTopic,
      zoomMeetDto.startTime,
      zoomMeetDto.duration,
    );
    const meetSession:SessionMeet = await this.sessionMeetModel.create({
      mentorUser: userId,
      mentor: createZoomMeet.mentorId,
      meetingTopic: zoomMeetDto.meetingTopic,
      startTime: zoomMeetDto.startTime,
      durationInMinute: zoomMeetDto.duration,
      meetingLink: createZoomMeet.join_url
    });
    return meetSession;
  }
}
