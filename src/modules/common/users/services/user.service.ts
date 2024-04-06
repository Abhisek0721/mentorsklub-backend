import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/users.model';
import { DATABASE_NAME } from '@constants/index';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { ChangePasswordDTO } from '../dto/changePassword.dto';
import * as bcrypt from 'bcrypt';
import { EditUserDTO } from '../dto/editUser.dto';
import { UploadProfileImageDTO } from '../dto/uploadProfileImage.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
  ) {}

  async userExist(email: string): Promise<boolean> {
    const isUser = await this.userModel.exists({
      email: email.toLowerCase(),
    });
    if (isUser) {
      return true;
    }
    return false;
  }

  async getUser(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDTO,
    userId: string | Types.ObjectId,
  ): Promise<UpdateWriteOpResult> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(
        `User with userId ${userId} doesn't exist!`,
      );
    }
    const comparedPassword = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!comparedPassword) {
      throw new BadRequestException('Incorrect Password!');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    const updatePassword = await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          password: hashedPassword,
        },
      },
    );
    return updatePassword;
  }

  async editUser(
    editUserDto: EditUserDTO,
    userId: string | Types.ObjectId,
  ): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
        },
        {
          fullName: editUserDto.fullName,
          phoneNumber: editUserDto.phoneNumber,
          location: editUserDto.location,
        },
        { new: true },
      )
      .select('-password');
    return user;
  }

  async getUserById(userId: string | Types.ObjectId): Promise<User> {
    const user: User = await this.userModel
      .findById(userId)
      .select('-password');
    return user;
  }

  async updateProfileImage(
    userId: string | Types.ObjectId,
    profileImageDto: UploadProfileImageDTO,
  ): Promise<User> {
    const user: User = await this.userModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userId),
      },
      {
        $set: {
          profileImageKey: profileImageDto.profileImageUri,
        },
      },
      { new: true },
    ).select("-password");
    return user;
  }
}
