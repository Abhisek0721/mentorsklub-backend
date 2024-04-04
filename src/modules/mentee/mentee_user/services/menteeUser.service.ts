import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@common/users/models/users.model';
import { DATABASE_NAME, MentorshipField, ROLES } from '@constants/index';
import { Model, Types } from 'mongoose';
import { Mentee } from '../models/mentee.model';
import { MenteeInterestedFieldDTO } from '../dto/menteeInterestedField.dto';

@Injectable()
export class MenteeUserService {
  constructor(
    @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
    @InjectModel(Mentee.name, DATABASE_NAME) private menteeModel: Model<Mentee>,
  ) {}

  async getMenteeData(userId: string | Types.ObjectId): Promise<Mentee> {
    const mentee: Mentee = await this.menteeModel
      .findOne({
        user: userId,
      })
      .populate({
        path: 'user',
        select: '-password',
      });
    return mentee;
  }

  async getAllMenteesData(pageNumber: number, limit: number) {
    if (!pageNumber || pageNumber < 0) {
      pageNumber = 1;
    }
    if (!limit || limit < 1) {
      limit = 10;
    }
    const mentorCount = await this.userModel.countDocuments({
      role: ROLES.MENTEE,
    });
    let totalPages = (mentorCount / limit) | 0;
    if (totalPages < mentorCount / limit) {
      totalPages = totalPages + 1;
    }
    const skipFrom = (pageNumber - 1) * limit;
    const mentorData = await this.menteeModel
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

  async updateInterestedFields(
    userId: string | Types.ObjectId,
    menteeInterestedField: MenteeInterestedFieldDTO,
  ): Promise<Mentee> {
    const mentee: Mentee = await this.menteeModel.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: {
          fieldOnInterests: menteeInterestedField.interestedFields,
        },
      },
      { new: true },
    );
    return mentee;
  }
}
