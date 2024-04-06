import { DATABASE_NAME } from '@constants/index';
import { Mentee } from '@modules/mentee/mentee_user/models/mentee.model';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription } from '@modules/mentee/subscription/models/subscription.model';

@Injectable()
export class MentorSubscriptionService {
  constructor(
    @InjectModel(Mentor.name, DATABASE_NAME) private mentorModel: Model<Mentor>,
    @InjectModel(Mentee.name, DATABASE_NAME) private menteeModel: Model<Mentee>,
    @InjectModel(Subscription.name, DATABASE_NAME)
    private subscriptionModel: Model<Subscription>,
  ) {}

  async getSubscriberMentees(
    mentorUserId: string | Types.ObjectId,
    pageNumber: number,
    limit: number,
  ) {
    if (!pageNumber || pageNumber < 0) {
      pageNumber = 1;
    }
    if (!limit || limit < 1) {
      limit = 10;
    }
    const mentor = await this.mentorModel
      .findOne({
        user: mentorUserId,
      })
      .select('_id user');
    // total number of sessions
    const totalCount = await this.subscriptionModel.countDocuments({
      mentor: mentor._id,
    });
    // total pages for pagination
    let totalPages = (totalCount / limit) | 0;
    if (totalPages < totalCount / limit) {
      totalPages = totalPages + 1;
    }
    const subscription = await this.subscriptionModel
      .findOne({
        mentor: mentor._id,
      })
      .select('-mentor')
      .populate('menteeUser')
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .sort({ createdAt: 1 })
      .lean();

    return {
      data: subscription,
      totalData: totalCount,
      totalPages: totalPages,
      currentPage: pageNumber,
    };
  }
}
