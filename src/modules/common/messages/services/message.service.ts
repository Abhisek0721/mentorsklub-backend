import { DATABASE_NAME } from '@constants/index';
import { User } from '@modules/common/users/models/users.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../models/message.model';
import { SendMessageDTO } from '../dto/sendMessage.dto';
import { ValidateDataUtils } from '@utils/utils.service';
import { EditMessageDTO } from '../dto/editMessage.dto';

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
    ValidateDataUtils.validateObjectIdString(
      sendMessageDto.receiverUserId,
      'receiverUserId',
    );
    const checkReceiver = await this.userModel.exists({
      _id: new Types.ObjectId(sendMessageDto.receiverUserId),
    });
    if (!checkReceiver) {
      throw new BadRequestException(
        `Receiver with userId ${sendMessageDto.receiverUserId} doesn't exist`,
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

  async editMessage(
    senderUserId: string | Types.ObjectId,
    editMessageDto: EditMessageDTO,
  ): Promise<Message> {
    ValidateDataUtils.validateObjectIdString(editMessageDto.messageId, 'messageId');
    const message = await this.messageModel.findOneAndUpdate(
      {
        _id: editMessageDto.messageId,
        sender: senderUserId,
      },
      {
        content: editMessageDto.content,
      },
      { new: true },
    );
    if(!message) {
      throw new BadRequestException(
        `Message with messageId ${editMessageDto.messageId} doesn't exist`
      );
    }
    return message;
  }

  async getMessagesOfSender(
    receiverUserId: string | Types.ObjectId,
    senderUserId: string,
  ): Promise<Message[]> {
    ValidateDataUtils.validateObjectIdString(senderUserId, 'senderUserId');
    const checkReceiver = await this.userModel.exists({
      _id: new Types.ObjectId(senderUserId),
    });
    if (!checkReceiver) {
      throw new BadRequestException(
        `Sender with userId ${senderUserId} doesn't exist`,
      );
    }
    const messages: Message[] = await this.messageModel
      .find({
        $or: [
          { sender: [new Types.ObjectId(senderUserId), receiverUserId] },
          { receiver: [new Types.ObjectId(senderUserId), receiverUserId] },
        ],
        deleted: false,
      })
      .select('-deleted');
    return messages;
  }

  async messageContactUsers(receiverUserId: string | Types.ObjectId) {
    const userId =
      receiverUserId instanceof Types.ObjectId
        ? receiverUserId
        : new Types.ObjectId(receiverUserId);
    const senderIds: any[] = await this.messageModel
      .find({
        $or: [{ sender: userId }, { receiver: userId }],
        deleted: false,
      })
      .distinct('sender')
      .exec();

    const receiverIds: any[] = await this.messageModel
      .find({
        $or: [{ sender: userId }, { receiver: userId }],
        deleted: false,
      })
      .distinct('receiver')
      .exec();

    const userIDs = [...new Set([...senderIds, ...receiverIds])];

    const users: User[] = await this.userModel
      .find({
        _id: { $in: userIDs },
      })
      .select('-password')
      .exec();

    return users;
  }

  async deleteMessage(
    senderUserId: string | Types.ObjectId,
    messageId: string
  ) {
    ValidateDataUtils.validateObjectIdString(messageId, 'messageId');
    const messageDelete = await this.messageModel.updateOne(
      {
        _id: new Types.ObjectId(messageId),
        sender: senderUserId,
      },
      {
        $set: {
          delete: true
        }
      }
    );
    return messageDelete;
  }
}
