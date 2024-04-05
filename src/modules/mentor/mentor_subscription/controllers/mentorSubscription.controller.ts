import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MentorSubscriptionService } from '../services/mentorSubscription.service';
import { ApiPageUtils, ApiUtilsService } from '@utils/utils.service';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { RoleGuard } from '@modules/common/auth/services/role.guard';
import { Roles } from '@modules/common/auth/decorators/role.decorator';
import { ROLES } from '@constants/index';
import { IAuthRequest } from '@utils/interfaces';
import { PageT } from '@utils/types';

@Controller()
export class MentorSubscriptionController {
  constructor(
    private readonly mentorSubscriptionService: MentorSubscriptionService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('all-subscriber-mentees')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTOR)
  async subscriberMentees(
    @Req() req: IAuthRequest,
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
  ) {
    const mentorUserId = req.user.userId;
    const data = await this.mentorSubscriptionService.getSubscriberMentees(
      mentorUserId,
      Number(pageNumber),
      Number(limit),
    );
    const page: PageT = ApiPageUtils.getPageData(data);
    return this.apiUtils.make_paginated_response({ data, page });
  }
}
