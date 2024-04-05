import { Module } from '@nestjs/common';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/models/users.model';
import { DATABASE_NAME } from '@constants/index';
import { Message, MessageSchema } from './models/message.model';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Message.name, schema: MessageSchema }
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
