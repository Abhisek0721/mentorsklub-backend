import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SessionMeetService } from '../services/session.service';
import { ApiUtilsService } from '@utils/utils.service';
import { IAuthRequest } from '@utils/interfaces';
import { ZoomMeetDTO } from '../dto/zoomMeet.dto';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { RoleGuard } from '@modules/common/auth/services/role.guard';
import { Roles } from '@modules/common/auth/decorators/role.decorator';
import { ROLES } from '@constants/index';
import { SessionMeet } from '../models/sessionModel.model';
import { ApiResponseT } from '@utils/types';

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
  ):Promise<ApiResponseT> {
    const userId = req.user.userId;
    const meetingSession: SessionMeet =
      await this.sessionMeetService.createZoomMeetLink(userId, zoomMeetDto);
    const response:ApiResponseT = this.apiUtils.make_response(meetingSession);
    return response;
  }
}
