import { DATABASE_NAME, ROLES } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { BadRequestException, Injectable } from '@nestjs/common';
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
      .select('-zoomTokens')
      .lean();
    return mentorData;
  }

  async getMentorProfile(userId: string | Types.ObjectId) {
    let mentorData = await this.mentorProfileModel
      .findOne({
        user: userId,
      })
      .populate({
        path: 'user mentor',
        select: '-password -createdAt -updatedAt -zoomTokens',
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

  async getMentorProfileByMentorId(mentorId: string) {
    let mentorData = await this.mentorProfileModel
      .findOne({
        mentor: new Types.ObjectId(mentorId),
      })
      .populate({
        path: 'user mentor',
        select: '-password -createdAt -updatedAt -zoomTokens',
      })
      .lean();
    // if mentorProfile data is null, then create it
    if (!mentorData) {
      throw new BadRequestException(
        `Mentor with mentorId ${mentorId} doesn't exist`,
      );
    }
    return mentorData;
  }

  async getAllMentorData(
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
    const mentorCount = await this.userModel.countDocuments({
      role: ROLES.MENTOR,
    });
    let totalPages = (mentorCount / limit) | 0;
    if (totalPages < mentorCount / limit) {
      totalPages = totalPages + 1;
    }
    const skipFrom = (pageNumber - 1) * limit;
    const mentorData = await this.mentorModel.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $sort: { createdAt: 1 } },
      { $skip: skipFrom },
      { $limit: limit },
      {
        $lookup: {
          from: 'subscriptions',
          let: { mentorId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$mentor', '$$mentorId'] },
                    { $eq: ['$menteeUser', menteeUserId] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: 'subscription',
        },
      },
      {
        $addFields: {
          subscription: {
            $cond: {
              if: { $gt: [{ $size: '$subscription' }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          mentorUserId: '$user._id',
          mentorId: '$_id',
          mentorName: '$user.fullName',
          mentorEmail: '$user.email',
          mentorProfileUrl: '$user.profileImageKey',
          mentorLocation: '$user.location',
          mentorPhoneNumber: '$user.phoneNumber',
          mentorField: '$field',
          mentorAvailabilityTime: '$availabilityTime',
          mentorTeaches: '$teaches',
          subscription: '$subscription',
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
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
  ): Promise<MentorProfile> {
    const mentorProfile = this.mentorProfileModel.findOneAndUpdate(
      {
        user: userId,
        mentor: mentorId,
      },
      {
        $set: mentorProfileDto,
      },
      {
        new: true,
        upsert: true,
      },
    );
    return mentorProfile;
  }


  async getZoomAuthStatus(mentorUserId:string|Types.ObjectId):Promise<{status: boolean}> {
    const mentor = await this.mentorModel.findOne(
      {
        user: mentorUserId
      }
    ).select("zoomTokens");
    if(mentor?.zoomTokens?.refreshToken) {
      return {
        status: true
      }
    }
    return {
      status: false
    }
  }
}
