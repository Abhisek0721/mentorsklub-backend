import { Module } from '@nestjs/common';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/models/users.model';
import { DATABASE_NAME } from '@constants/index';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      DATABASE_NAME,
    ),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
