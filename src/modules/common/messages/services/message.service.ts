import { DATABASE_NAME } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
  ) {}
}
