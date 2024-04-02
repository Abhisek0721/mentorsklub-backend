import { DATABASE_NAME } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDTO } from '../dto/signup.dto';
import { SignupResponseType } from '../types/signupResponse.type';
import { UserService } from '@modules/common/users/services/user.service';
import { LoginDTO } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private configSvc: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
    @InjectModel(Mentor.name, DATABASE_NAME) private mentorModel: Model<Mentor>,
  ) {}

  async signup(user: SignupDTO): Promise<SignupResponseType> {
    const checkUser:boolean = await this.userService.userExist(user.email);
    if(checkUser) {
      throw new BadRequestException(
        "User with this email already registered!",
      );
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.userModel.create({
      fullName: user.fullName,
      email: user.email.toLowerCase(),
      password: hashedPassword,
      role: user.role,
    });
    const token = this.jwtService.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
      },
      {
        secret: this.configSvc.get<string>('JWT_SECRET'),
        expiresIn: this.configSvc.get<string>('JWT_EXPIRY_TIME'),
      },
    );
    const data:SignupResponseType = {
      userData: {
        _id: createdUser._id,
        fullName: createdUser.fullName,
        email: createdUser.email,
        role: createdUser.role,
        isVerified: createdUser.isVerified
      },
      accessToken: token,
    }
    return data;
  }


  async login(loginDto: LoginDTO): Promise<SignupResponseType> {
    const user = await this.userService.getUser(loginDto.email);
    if(!user) {
      throw new BadRequestException(
        "User with this email doesn't exist!",
      );
    }
    const comparedPassword = await bcrypt.compare(loginDto.password, user.password)
    if(!comparedPassword) {
      throw new BadRequestException(
        "Incorrect Password!",
      );
    }
    const token = this.jwtService.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      {
        secret: this.configSvc.get<string>('JWT_SECRET'),
        expiresIn: this.configSvc.get<string>('JWT_EXPIRY_TIME'),
      },
    );
    const data:SignupResponseType = {
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      accessToken: token,
    }
    return data;
  }

}
