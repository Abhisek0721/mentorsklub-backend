import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { ApiUtilsService } from '@utils/utils.service';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { IAuthRequest } from '@utils/interfaces';
import { SendMessageDTO } from '../dto/sendMessage.dto';
import { Message } from '../models/message.model';
import { ApiResponseT } from '@utils/types';

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
}
