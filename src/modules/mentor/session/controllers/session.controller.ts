import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionMeetService } from '../services/session.service';
import { ApiPageUtils, ApiUtilsService } from '@utils/utils.service';
import { IAuthRequest } from '@utils/interfaces';
import { ZoomMeetDTO } from '../dto/zoomMeet.dto';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { RoleGuard } from '@modules/common/auth/services/role.guard';
import { Roles } from '@modules/common/auth/decorators/role.decorator';
import { ROLES } from '@constants/index';
import { SessionMeet } from '../models/sessionModel.model';
import { ApiResponseT, PageT } from '@utils/types';

@Controller()
export class SessionMeetController {
  constructor(
    private readonly sessionMeetService: SessionMeetService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Post('create-zoom-meet')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTOR)
  async createZoomMeet(
    @Req() req: IAuthRequest,
    @Body() zoomMeetDto: ZoomMeetDTO,
  ): Promise<ApiResponseT> {
    const userId = req.user.userId;
    const meetingSession: SessionMeet =
      await this.sessionMeetService.createZoomMeetLink(userId, zoomMeetDto);
    const response: ApiResponseT = this.apiUtils.make_response(meetingSession);
    return response;
  }

  @Get('get-session/:sessionId')
  @UseGuards(JwtAuthGuard)
  async getSession(
    @Param('sessionId') sessionId: string,
  ): Promise<ApiResponseT> {
    const sessionData: SessionMeet =
      await this.sessionMeetService.getSessionById(sessionId);
    return this.apiUtils.make_response(sessionData);
  }

  @Get('get-all-sessions')
  @UseGuards(JwtAuthGuard)
  async getUpcomingAndLiveSessions(
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
  ): Promise<ApiResponseT> {
    const data = await this.sessionMeetService.getUpcomingAndLiveSessions(
      pageNumber,
      limit,
    );
    const page: PageT = ApiPageUtils.getPageData(data);
    return this.apiUtils.make_paginated_response({ data, page });
  }

  @Get('get-sessions-of-mentor')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTOR)
  async getSessionsOfMentor(
    @Req() req:IAuthRequest,
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
  ): Promise<ApiResponseT> {
    const userId = req.user.userId;
    const data = await this.sessionMeetService.getUpcomingAndLiveSessionsOfMentor(
      userId,
      pageNumber,
      limit,
    );
    const page: PageT = ApiPageUtils.getPageData(data);
    return this.apiUtils.make_paginated_response({ data, page });
  }
}
