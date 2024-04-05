import { DATABASE_NAME } from '@constants/index';
import { Mentee } from '@modules/mentee/mentee_user/models/mentee.model';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { SessionMeet } from '@modules/mentor/session/models/sessionModel.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { Subscription } from '../models/subscription.model';
import { SubscriptionStatusType } from '../types/subscriptionStatus.type';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Mentor.name, DATABASE_NAME) private mentorModel: Model<Mentor>,
    @InjectModel(Mentee.name, DATABASE_NAME) private menteeModel: Model<Mentee>,
    @InjectModel(Subscription.name, DATABASE_NAME)
    private subscriptionModel: Model<Subscription>,
    @InjectModel(SessionMeet.name, DATABASE_NAME)
    private sessionMeetModel: Model<SessionMeet>,
  ) {}

  private async checkMentor(mentorId: string) {
    const checkMentor = await this.mentorModel.exists({
      _id: new Types.ObjectId(mentorId),
    });
    if (checkMentor) {
      return true;
    }
    return false;
  }

  async subscribeToMentor(
    menteeUserId: string | Types.ObjectId,
    mentorId: string,
  ): Promise<UpdateWriteOpResult> {
    const checkMentor = await this.checkMentor(mentorId);
    if (!checkMentor) {
      throw new BadRequestException(
        `Mentor with mentorId ${mentorId} doesn't exist`,
      );
    }
    const mentee = await this.menteeModel
      .findOne({
        user: menteeUserId,
      })
      .select('_id user');

    // update subscribe data if exists orelse create it
    const subscribeUpdate: UpdateWriteOpResult =
      await this.subscriptionModel.updateOne(
        {
          menteeUser: menteeUserId,
          mentee: mentee._id,
          mentor: new Types.ObjectId(mentorId),
        },
        {},
        {
          new: true,
          upsert: true,
        },
      );
    return subscribeUpdate;
  }

  async unsubscribeMentor(
    menteeUserId: string | Types.ObjectId,
    mentorId: string,
  ) {
    const checkMentor = await this.checkMentor(mentorId);
    if (!checkMentor) {
      throw new BadRequestException(
        `Mentor with mentorId ${mentorId} doesn't exist`,
      );
    }
    const mentee = await this.menteeModel
      .findOne({
        user: menteeUserId,
      })
      .select('_id user');

    // update subscribe data if exists orelse create it
    const subscribeUpdate = await this.subscriptionModel.deleteOne({
      menteeUser: menteeUserId,
      mentee: mentee._id,
      mentor: new Types.ObjectId(mentorId),
    });
    return subscribeUpdate;
  }

  async getSessionsOfSubscribedMentor(
    menteeUserId: string | Types.ObjectId,
    mentorId: string,
    pageNumber: number,
    limit: number,
  ) {
    if (!pageNumber || pageNumber < 0) {
      pageNumber = 1;
    }
    if (!limit || limit < 1) {
      limit = 10;
    }
    // verify mentorId
    const checkMentor = await this.checkMentor(mentorId);
    if (!checkMentor) {
      throw new BadRequestException(
        `Mentor with mentorId ${mentorId} doesn't exist`,
      );
    }
    // verify subscription
    const subscription = await this.subscriptionModel
      .findOne({
        menteeUser: menteeUserId,
        mentor: mentorId,
      })
      .select('mentor');

    if (!subscription) {
      throw new BadRequestException(
        `Subscription not found for mentorId ${mentorId}`,
      );
    }
    // total number of sessions
    const totalCount = await this.sessionMeetModel.countDocuments({
      mentor: subscription.mentor,
    });
    // total pages for pagination
    let totalPages = (totalCount / limit) | 0;
    if (totalPages < totalCount / limit) {
      totalPages = totalPages + 1;
    }
    // fetch all sessions of a subscribed mentor
    const sessionData = await this.sessionMeetModel
      .find({
        mentor: subscription.mentor,
      })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .sort({ startTime: -1 })
      .lean(); // Sort by startTime in descending order;

    return {
      data: sessionData,
      totalData: totalCount,
      totalPages: totalPages,
      currentPage: pageNumber,
    };
  }

  async getAllSubscribedMentors(
    menteeUserId: string | Types.ObjectId,
    pageNumber: number,
    limit: number,
  ) {
    if (!pageNumber || pageNumber < 0) {
      pageNumber = 1;
    }
    if (!limit || limit < 1) {
      limit = 10;
    }
    // total number of subscription
    const totalCount = await this.subscriptionModel.countDocuments({
      menteeUser: menteeUserId,
    });
    // total pages for pagination
    let totalPages = (totalCount / limit) | 0;
    if (totalPages < totalCount / limit) {
      totalPages = totalPages + 1;
    }
    const subscribedMentors = await this.subscriptionModel.aggregate([
      { $match: { menteeUser: menteeUserId } },
      {
        $lookup: {
          from: 'mentors',
          localField: 'mentor',
          foreignField: '_id',
          as: 'mentor',
        },
      },
      { $unwind: '$mentor' },
      {
        $lookup: {
          from: 'users',
          localField: 'mentor.user',
          foreignField: '_id',
          as: 'mentor.user',
        },
      },
      { $unwind: '$mentor.user' },
      {
        $project: {
          mentorUserId: '$mentor.user._id',
          mentorId: '$mentor._id',
          mentorName: '$mentor.user.fullName',
          mentorEmail: '$mentor.user.email',
          mentorPhoneNumber: '$mentor.user.phoneNumber',
          mentorField: '$mentor.field',
          mentorAvailabilityTime: '$mentor.availabilityTime',
          mentorTeaches: '$mentor.teaches',
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNumber - 1) * limit },
      { $limit: limit },
    ]);
    return {
      data: subscribedMentors,
      totalData: totalCount,
      totalPages: totalPages,
      currentPage: pageNumber,
    };
  }

  async getSubscriptionStatus(
    menteeUserId: string | Types.ObjectId,
  ): Promise<SubscriptionStatusType> {
    const checkSubscription = await this.subscriptionModel.exists({
      menteeUser: menteeUserId,
    });
    if (checkSubscription) {
      return {
        subscription: true,
      };
    }
    return {
      subscription: false,
    };
  }
}
