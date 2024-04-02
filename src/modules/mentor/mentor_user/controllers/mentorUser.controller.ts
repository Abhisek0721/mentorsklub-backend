import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MentorUserService } from '@modules/mentor/mentor_user/services/mentorUser.service';
import { ApiUtilsService } from '@utils/utils.service';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { IAuthRequest } from '@utils/interfaces';
import { ApiResponseT } from '@utils/types';
import { Roles } from '@modules/common/auth/decorators/role.decorator';
import { RoleGuard } from '@modules/common/auth/services/role.guard';
import { ROLES } from '@constants/index';

@Controller()
export class MentorUserController {
  constructor(
    private readonly mentorUserService: MentorUserService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTOR)
  async getMentor(@Req() req: IAuthRequest):Promise<ApiResponseT> {
    const userId = req.user.userId;
    const mentorData = await this.mentorUserService.getMentorData(userId);
    const response:ApiResponseT = this.apiUtils.make_response(mentorData);
    return response;
  }


}
