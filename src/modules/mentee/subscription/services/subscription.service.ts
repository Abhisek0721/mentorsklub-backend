import { DATABASE_NAME } from '@constants/index';
import { Mentee } from '@modules/mentee/mentee_user/models/mentee.model';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { SessionMeet } from '@modules/mentor/session/models/sessionModel.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { Subscription } from '../models/subscription.model';

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
    if(checkMentor) {
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
    const subscribeUpdate =
      await this.subscriptionModel.deleteOne(
        {
          menteeUser: menteeUserId,
          mentee: mentee._id,
          mentor: new Types.ObjectId(mentorId),
        }
      );
    return subscribeUpdate;
  }
}
