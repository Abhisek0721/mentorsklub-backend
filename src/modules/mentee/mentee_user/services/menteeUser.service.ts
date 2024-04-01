import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from '@common/users/models/users.model';
import { DATABASE_NAME } from '@constants/index';
import { Model } from 'mongoose';

@Injectable()
export class MenteeUserService {
  constructor(
    // @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
  ) {}

  async getUser() {
    const user = {
      firstName: 'Abhisekh',
      lastName: 'Upadhaya',
      email: 'abhisek0721@gmail.com',
      userType: 'mentee',
    };
    return user;
  }
}
