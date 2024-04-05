import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { SubscriptionService } from '../services/subscription.service';
import { IAuthRequest } from '@utils/interfaces';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { RoleGuard } from '@modules/common/auth/services/role.guard';
import { Roles } from '@modules/common/auth/decorators/role.decorator';
import { ROLES } from '@constants/index';
import { UpdateWriteOpResult } from 'mongoose';
import { ApiResponseT } from '@utils/types';

@Controller()
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Post('subscribe-to-mentor/:mentorId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTEE)
  async subscribeToMentor(
    @Req() req: IAuthRequest,
    @Param('mentorId') mentorId: string,
  ) {
    const userIdOfMentee = req.user.userId;
    const subscribeUpdate: UpdateWriteOpResult =
      await this.subscriptionService.subscribeToMentor(
        userIdOfMentee,
        mentorId,
      );
    const response: ApiResponseT = this.apiUtils.make_response(
      subscribeUpdate,
      'Subscribed Successfully',
    );
    return response;
  }

  @Delete('unsubscribe-mentor/:mentorId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTEE)
  async unsubscribeMentor(
    @Req() req: IAuthRequest,
    @Param('mentorId') mentorId: string,
  ) {
    const userIdOfMentee = req.user.userId;
    const subscribeUpdate = await this.subscriptionService.unsubscribeMentor(
      userIdOfMentee,
      mentorId,
    );
    let message;
    if(subscribeUpdate.deletedCount > 0) {
        message = "Unsubscribed Successfully";
    }else{
        message = "Already Unsubscribed"
    }
    const response: ApiResponseT = this.apiUtils.make_response(
      subscribeUpdate,
      message,
    );
    return response;
  }
}
