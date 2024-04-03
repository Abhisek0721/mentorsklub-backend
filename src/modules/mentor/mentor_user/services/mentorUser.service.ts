import { DATABASE_NAME, ROLES } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mentor } from '../models/mentor.model';
import {
  AvailabilityTimeDTO,
  MentorDTO,
  MentorProfileDTO,
} from '../dto/mentor.dto';
import { MentorProfile } from '../models/mentorProfile.model';

@Injectable()
export class MentorUserService {
  constructor(
    @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
    @InjectModel(Mentor.name, DATABASE_NAME) private mentorModel: Model<Mentor>,
    @InjectModel(MentorProfile.name, DATABASE_NAME)
    private mentorProfileModel: Model<MentorProfile>,
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

  async getMentorPrfile(userId: string | Types.ObjectId) {
    let mentorData = await this.mentorProfileModel
      .findOne({
        user: userId,
      })
      .populate({
        path: 'user mentor',
        select: '-password -createdAt -updatedAt',
      })
      .lean();
    // if mentorProfile data is null, then create it
    if (!mentorData) {
      const mentor = await this.mentorModel.findOne({ user: userId });
      mentorData = await this.mentorProfileModel.create({
        user: userId,
        mentor: mentor._id,
      });
    }
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
    if (totalPages < mentorCount / limit) {
      totalPages = totalPages + 1;
    }
    const skipFrom = (pageNumber - 1) * limit;
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

  async updateMentor(
    userId: string | Types.ObjectId,
    mentorDto: MentorDTO,
  ): Promise<Mentor> {
    const updatedData: Mentor = await this.mentorModel.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: mentorDto,
      },
      { new: true },
    );
    return updatedData;
  }

  async updateAvailabilityTime(
    userId: string | Types.ObjectId,
    availabilityTime: AvailabilityTimeDTO,
  ): Promise<Mentor> {
    const updatedData: Mentor = await this.mentorModel.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: {
          availabilityTime: availabilityTime,
        },
      },
      { new: true },
    );
    return updatedData;
  }

  async updateMentorProfile(
    userId: string | Types.ObjectId,
    mentorId: string,
    mentorProfileDto: MentorProfileDTO,
  ):Promise<MentorProfile> {
    const mentorProfile = this.mentorProfileModel.findOneAndUpdate(
      {
        user: userId,
        mentor: mentorId
      },
      {
        $set: mentorProfileDto
      },
      {
        new: true,
        upsert: true
      }
    );
    return mentorProfile;
  }
}
