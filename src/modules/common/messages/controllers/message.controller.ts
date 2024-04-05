import { Controller } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { ApiUtilsService } from '@utils/utils.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly apiUtils: ApiUtilsService,
  ) {}
}
