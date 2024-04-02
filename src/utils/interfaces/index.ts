export * from './response.interface';

import { ROLES } from '@constants/index';
import { Request } from 'express';
import { Types } from 'mongoose';

export interface IAuthRequest extends Request {
  user: {
    userId: string|Types.ObjectId;
    email: string;
    role: ROLES;
  }
}
