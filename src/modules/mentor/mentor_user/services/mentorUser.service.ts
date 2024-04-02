import { DATABASE_NAME, ROLES } from '@constants/index';
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

  async getAllMentorData(pageNumber: number, limit: number) {
    if (!pageNumber || pageNumber < 0) {
      pageNumber = 1;
    }
    if (!limit || limit < 1) {
      limit = 10;
    }
    const mentorCount = await this.userModel.countDocuments({
      role: ROLES.MENTOR,
    });
    let totalPages = (mentorCount / limit) | 0;
    if(totalPages<(mentorCount/limit)) {
      totalPages = totalPages+1;
    }
    const skipFrom = (pageNumber-1)*limit;
    const mentorData = await this.mentorModel
      .find()
      .populate({
        path: 'user',
        select: '-password -createdAt -updatedAt',
      })
      .limit(limit)
      .skip(skipFrom)
      .lean();
    return {
      data: mentorData,
      totalData: mentorCount,
      totalPages: totalPages,
      currentPage: pageNumber,
    };
  }
}
