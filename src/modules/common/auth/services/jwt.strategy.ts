import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwtPayload.type';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@modules/common/users/models/users.model';
import { InjectModel } from '@nestjs/mongoose';
import { DATABASE_NAME } from '@constants/index';
import { Model } from 'mongoose';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user = await this.userModel.findOne(
      {
        _id: payload.userId,
        email: payload.email
      }
    );
    if (user) {
      return user;
    }
    return null;
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
