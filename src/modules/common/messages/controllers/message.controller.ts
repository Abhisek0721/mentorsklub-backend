import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { ApiUtilsService } from '@utils/utils.service';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { IAuthRequest } from '@utils/interfaces';
import { SendMessageDTO } from '../dto/sendMessage.dto';
import { Message } from '../models/message.model';
import { ApiResponseT } from '@utils/types';
import { User } from '@modules/common/users/models/users.model';
import { EditMessageDTO } from '../dto/editMessage.dto';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Post('send-message')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Req() req: IAuthRequest,
    @Body() sendMessageDto: SendMessageDTO,
  ): Promise<ApiResponseT> {
    const senderUserId = req.user.userId;
    const messageData: Message = await this.messageService.sendMessage(
      senderUserId,
      sendMessageDto,
    );
    const response: ApiResponseT = this.apiUtils.make_response(messageData);
    return response;
  }

  @Patch('edit-message')
  @UseGuards(JwtAuthGuard)
  async editMessage(
    @Req() req: IAuthRequest,
    @Body() editMessageDto: EditMessageDTO,
  ): Promise<ApiResponseT> {
    const senderUserId = req.user.userId;
    const messageData: Message = await this.messageService.editMessage(
      senderUserId,
      editMessageDto,
    );
    const response: ApiResponseT = this.apiUtils.make_response(messageData);
    return response;
  }

  @Get('get-messages/:senderUserId')
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Req() req: IAuthRequest,
    @Param('senderUserId') senderUserId: string,
  ):Promise<ApiResponseT> {
    const receiverUserId = req.user.userId;
    const messages: Message[] = await this.messageService.getMessagesOfSender(
      receiverUserId,
      senderUserId,
    );
    return this.apiUtils.make_response(messages);
  }

  @Get('message-contact-users')
  @UseGuards(JwtAuthGuard)
  async messageContactUsers(
    @Req() req: IAuthRequest,
  ):Promise<ApiResponseT> {
    const receiverUserId = req.user.userId;
    const senders:User[] = await this.messageService.messageContactUsers(receiverUserId);
    return this.apiUtils.make_response(senders);
  }

  @Delete('delete-message/:messageId')
  @UseGuards(JwtAuthGuard)
  async deleteMessage(
    @Req() req: IAuthRequest,
    @Param('messageId') messageId: string
  ):Promise<ApiResponseT> {
    const output = await this.messageService.deleteMessage(req.user.userId, messageId);
    return this.apiUtils.make_response(output);
  }
}
