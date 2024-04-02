import { DATABASE_NAME } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mentor } from '../models/mentor.model';

@Injectable()
export class MentorUserService {
  constructor(
    @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
    @InjectModel(Mentor.name, DATABASE_NAME) private mentorModel: Model<Mentor>,
  ) {}

  async getMentorData(userId: string | Types.ObjectId) {
    const mentorData = await this.mentorModel
      .findOne({
        user: userId,
      })
      .populate({
        path: 'user',
        select: '-password -createdAt -updatedAt',
      })
      .lean();
    return mentorData;
  }
}
