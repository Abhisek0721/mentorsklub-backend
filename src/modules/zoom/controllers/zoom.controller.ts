import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { ZoomService } from '../services/zoom.services';
import { Request, Response } from 'express';
import { ZoomCallbackType } from '../types/zoomCallbackResponse.type';
import { RoleGuard } from '@modules/common/auth/services/role.guard';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { Roles } from '@modules/common/auth/decorators/role.decorator';
import { ROLES } from '@constants/index';
import { IAuthRequest } from '@utils/interfaces';
import { Mentor } from '@modules/mentor/mentor_user/models/mentor.model';
import { ApiResponseT } from '@utils/types';

@Controller('zoom')
export class ZoomController {
  constructor(
    private readonly zoomService: ZoomService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('oauth/authorize')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTOR)
  authorizeZoom(@Req() req: IAuthRequest):ApiResponseT {
    const userId = req.user.userId.toString();
    const authorizeUrl: string = this.zoomService.generateAuthorizeUrl(userId);
    const response:ApiResponseT =  this.apiUtils.make_response({authorizeUrl});
    return response;
  }

  @Get('oauth/callback')
  async zoomCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    const userId: string = state;
    const zoomTokens: ZoomCallbackType = await this.zoomService.zoomCallback(
      userId,
      code,
    );
    const updateMentor: Mentor =
      await this.zoomService.saveZoomTokens(zoomTokens);
    if (
      updateMentor.zoomTokens.accessToken !== zoomTokens.access_token ||
      updateMentor.zoomTokens.refreshToken !== zoomTokens.refresh_token
    ) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/zoomAuthorized?status=false`,
      );
    }
    return res.redirect(
      `${process.env.FRONTEND_URL}/zoomAuthorized?status=true`,
    );
  }
}
