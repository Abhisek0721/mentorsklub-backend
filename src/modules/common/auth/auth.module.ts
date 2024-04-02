import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/models/users.model';
import { Mentor, MentorSchema } from '@modules/mentor/mentor_user/models/mentor.model';
import { DATABASE_NAME } from '@constants/index';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './services/jwt.strategy';
import { UserService } from '../users/services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Mentor.name, schema: MentorSchema },
      ],
      DATABASE_NAME
    ),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
  exports: [JwtModule, PassportModule]
})
export class AuthModule {}
