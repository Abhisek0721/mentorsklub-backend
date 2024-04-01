import { DATABASE_NAME } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  // constructor(
  //   private cypherSvc: CypherService,
  //   private jwtSvc: JwtService,
  //   private configSvc: ConfigService,
  //   @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
  //   @InjectModel(Mentor.name, DATABASE_NAME) private mentorModel: Model<Mentor>,
  // ) {}

  // #createJwtPayload(user: User) {
  //   const { email } = user;
  //   const accessToken = this.jwtSvc.sign(
  //     { email },
  //     {
  //       secret: this.configSvc.get<string>('JWT_SECRET'),
  //       expiresIn: `${this.configSvc.get<number>('JWT_EXPIRY_TIME')}d`,
  //     },
  //   );
  //   this.jwtSvc.decode;
  //   return accessToken;
  // }
  // #createRefreshJwtPayload(user: User) {
  //   const { email } = user;

  //   const accessToken = this.jwtSvc.sign(
  //     { email },
  //     {
  //       secret: this.configSvc.get<string>('JWT_SECRET'),
  //       expiresIn: `${this.configSvc.get<number>('JWT_EXPIRY_TIME')}d`,
  //     },
  //   );
  //   this.jwtSvc.decode;
  //   return accessToken;
  // }

  // async login() {}

  // async signUp(
  //   createAuthDto: CreateAuthDto,
  // ): ApiResponse<AuthLoginSuccessResponse> {
  //   try {
  //     const { email, password, username, firstName, lastName, role } =
  //       createAuthDto;
  //     const isUser = await this.userModel
  //       .findOne({
  //         email,
  //       })
  //       .exec();

  //     if (isUser) {
  //       throw new BadRequestException('User already Exists');
  //     }
  //     const hashedPassword = await bcrypt.hash(password, 8);

  //     const newUser = await this.userModel.create({
  //       email,
  //       password: hashedPassword,
  //       username,
  //       firstName,
  //       lastName,
  //       role,
  //     });

  //     const jwt = await this.#createJwtPayload(newUser);
  //     const refershJwt = await this.#createRefreshJwtPayload(newUser);

  //     return {
  //       authToken: jwt,
  //       id: newUser._id,
  //     };
  //   } catch (err) {
  //     return err.message;
  //   }
  // }
}
