import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from '@modules/common/users/models/users.model';
import { DATABASE_NAME } from '@constants/index';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    // @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
  ) {}

  async login() {
    const user = {
      firstName: 'Abhisekh',
      lastName: 'Upadhaya',
      email: 'abhisek0721@gmail.com',
      userType: 'mentee',
    };
    return user;
  }
}
