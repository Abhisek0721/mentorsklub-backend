import { DATABASE_NAME } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../models/message.model';
import { SendMessageDTO } from '../dto/sendMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
    @InjectModel(Message.name, DATABASE_NAME)
    private messageModel: Model<Message>,
  ) {}

  async sendMessage(
    senderUserId: string | Types.ObjectId,
    sendMessageDto: SendMessageDTO,
  ): Promise<Message> {
    if(!sendMessageDto.receiverUserId) {
      throw new BadRequestException(
        `Invalid receiverUserId`
      );
    }
    const checkReceiver = await this.userModel.exists({
      _id: new Types.ObjectId(sendMessageDto.receiverUserId)
    });
    if(!checkReceiver) {
      throw new BadRequestException(
        `Receiver with userId ${sendMessageDto.receiverUserId} doesn't exist`
      );
    }
    const messageSent: Message = await this.messageModel.create({
      sender: senderUserId,
      receiver: new Types.ObjectId(sendMessageDto.receiverUserId),
      content: sendMessageDto.content,
      replyTo: sendMessageDto.replyTo,
    });
    return messageSent;
  }
}
