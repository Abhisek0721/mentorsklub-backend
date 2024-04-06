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

  private getEndTimeOfMeeting(startTime: Date, durationInMinute: number = 40) {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + durationInMinute);
    return endTime;
  }

  async createZoomMeetLink(
    userId: string | Types.ObjectId,
    zoomMeetDto: ZoomMeetDTO,
  ): Promise<SessionMeet> {
    const createZoomMeet = await this.zoomService.createZoomMeetingLink(
      userId,
      zoomMeetDto.meetingTopic,
      zoomMeetDto.startTime,
      zoomMeetDto.duration,
    );
    const meetSession: SessionMeet = await this.sessionMeetModel.create({
      mentorUser: userId,
      mentor: createZoomMeet.mentorId,
      meetingTopic: zoomMeetDto.meetingTopic,
      startTime: zoomMeetDto.startTime,
      endTime: this.getEndTimeOfMeeting(
        zoomMeetDto.startTime,
        zoomMeetDto.duration,
      ),
      durationInMinute: zoomMeetDto.duration,
      meetingLink: createZoomMeet.join_url,
    });
    return meetSession;
  }

  async getSessionById(sessionId: string): Promise<SessionMeet> {
    const sessionData: SessionMeet = await this.sessionMeetModel
      .findById(sessionId)
      .populate({
        path: 'mentorUser mentor',
        select: '-password -zoomTokens',
      });
    return sessionData;
  }

  async getUpcomingAndLiveSessions(pageNumber: number, limit: number) {
    if (!pageNumber || pageNumber < 0) {
      pageNumber = 1;
    }
    if (!limit || limit < 1) {
      limit = 10;
    }
    const currentTime = new Date();
    const totalCount = await this.sessionMeetModel.countDocuments({
      $or: [
        { startTime: { $gte: currentTime } }, // Upcoming sessions
        {
          $and: [
            { startTime: { $lte: currentTime } }, // Live sessions
            { endTime: { $gte: currentTime } },
          ],
        },
      ],
    });
    let totalPages = (totalCount / limit) | 0;
    if (totalPages < totalCount / limit) {
      totalPages = totalPages + 1;
    }
    const sessionData = await this.sessionMeetModel
      .find({
        $or: [
          { startTime: { $gte: currentTime } }, // Upcoming sessions
          {
            $and: [
              { startTime: { $lte: currentTime } }, // Live sessions
              { endTime: { $gte: currentTime } },
            ],
          },
        ],
      })
      .populate({
        path: 'mentorUser',
        select: '-password',
      })
      .populate({
        path: 'mentor',
        select: '-zoomTokens',
      })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .sort({ startTime: 1 })
      .lean(); // Sort by startTime in descending order;

    return {
      data: sessionData,
      totalData: totalCount,
      totalPages: totalPages,
      currentPage: pageNumber,
    };
  }

  async getUpcomingAndLiveSessionsOfMentor(
    userId: string | Types.ObjectId,
    pageNumber: number,
    limit: number,
  ) {
    if (!pageNumber || pageNumber < 0) {
      pageNumber = 1;
    }
    if (!limit || limit < 1) {
      limit = 10;
    }
    const currentTime = new Date();
    const totalCount = await this.sessionMeetModel.countDocuments({
      mentorUser: userId,
      $or: [
        { startTime: { $gte: currentTime } }, // Upcoming sessions
        {
          $and: [
            { startTime: { $lte: currentTime } }, // Live sessions
            { endTime: { $gte: currentTime } },
          ],
        },
      ],
    });
    let totalPages = (totalCount / limit) | 0;
    if (totalPages < totalCount / limit) {
      totalPages = totalPages + 1;
    }
    const sessionData = await this.sessionMeetModel
      .find({
        mentorUser: userId,
        $or: [
          { startTime: { $gte: currentTime } }, // Upcoming sessions
          {
            $and: [
              { startTime: { $lte: currentTime } }, // Live sessions
              { endTime: { $gte: currentTime } },
            ],
          },
        ],
      })
      .populate({
        path: 'mentorUser',
        select: '-password',
      })
      .populate({
        path: 'mentor',
        select: '-zoomTokens',
      })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .sort({ startTime: 1 })
      .lean(); // Sort by startTime in descending order;

    return {
      data: sessionData,
      totalData: totalCount,
      totalPages: totalPages,
      currentPage: pageNumber,
    };
  }
}
