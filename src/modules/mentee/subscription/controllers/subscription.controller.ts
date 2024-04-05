import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiPageUtils, ApiUtilsService } from '@utils/utils.service';
import { SubscriptionService } from '../services/subscription.service';
import { IAuthRequest } from '@utils/interfaces';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { RoleGuard } from '@modules/common/auth/services/role.guard';
import { Roles } from '@modules/common/auth/decorators/role.decorator';
import { ROLES } from '@constants/index';
import { UpdateWriteOpResult } from 'mongoose';
import { ApiResponseT, PageT } from '@utils/types';

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
    if (subscribeUpdate.deletedCount > 0) {
      message = 'Unsubscribed Successfully';
    } else {
      message = 'Already Unsubscribed';
    }
    const response: ApiResponseT = this.apiUtils.make_response(
      subscribeUpdate,
      message,
    );
    return response;
  }

  @Get('sessions-of-subscribed-mentor/:mentorId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTEE)
  async getSessionsOfSubscribedMentor(
    @Req() req: IAuthRequest,
    @Param('mentorId') mentorId: string,
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
  ): Promise<ApiResponseT> {
    const menteeUserId = req.user.userId;
    const data = await this.subscriptionService.getSessionsOfSubscribedMentor(
      menteeUserId,
      mentorId,
      Number(pageNumber),
      Number(limit),
    );
    const page: PageT = ApiPageUtils.getPageData(data);
    return this.apiUtils.make_paginated_response({ data, page });
  }


  @Get('all-subscribed-mentors')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTEE)
  async getAllSubscribedMentors(
    @Req() req: IAuthRequest,
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
  ):Promise<ApiResponseT> {
    const menteeUserId = req.user.userId;
    const data = await this.subscriptionService.getAllSubscribedMentors(
      menteeUserId,
      Number(pageNumber),
      Number(limit),
    );
    const page: PageT = ApiPageUtils.getPageData(data);
    return this.apiUtils.make_paginated_response({ data, page });
  }
}
