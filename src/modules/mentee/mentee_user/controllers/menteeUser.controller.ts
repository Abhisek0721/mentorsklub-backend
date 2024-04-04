import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenteeUserService } from '@modules/mentee/mentee_user/services/menteeUser.service';
import { ApiPageUtils, ApiUtilsService } from '@utils/utils.service';
import { ROLES } from '@constants/index';
import { Roles } from '@modules/common/auth/decorators/role.decorator';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { RoleGuard } from '@modules/common/auth/services/role.guard';
import { IAuthRequest } from '@utils/interfaces';
import { ApiResponseT, PageT } from '@utils/types';
import { Mentee } from '../models/mentee.model';
import { MenteeInterestedFieldDTO } from '../dto/menteeInterestedField.dto';

@Controller()
export class MenteeUserController {
  constructor(
    private readonly menteeUserService: MenteeUserService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTEE)
  async getMentee(@Req() req: IAuthRequest): Promise<ApiResponseT> {
    const userId = req.user.userId;
    const menteeData: Mentee =
      await this.menteeUserService.getMenteeData(userId);
    const response: ApiResponseT = this.apiUtils.make_response(menteeData);
    return response;
  }

  @Get('/all-mentees')
  @UseGuards(JwtAuthGuard)
  async getAllMentees(
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
  ): Promise<ApiResponseT> {
    const data = await this.menteeUserService.getAllMenteesData(
      Number(pageNumber),
      Number(limit),
    );
    const pageData: PageT = ApiPageUtils.getPageData({
      currentPage: data.currentPage,
      totalData: data.totalData,
      totalPages: data.totalPages,
    });
    const response: ApiResponseT = this.apiUtils.make_paginated_response({
      data: data.data,
      page: pageData,
    });
    return response;
  }

  @Put('/update-interested-fields')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTEE)
  async updateInterestedFields(
    @Req() req: IAuthRequest,
    @Body() menteeInterestedFieldDto: MenteeInterestedFieldDTO,
  ): Promise<ApiResponseT> {
    const userId = req.user.userId;
    const menteeData: Mentee =
      await this.menteeUserService.updateInterestedFields(
        userId,
        menteeInterestedFieldDto,
      );
    const response: ApiResponseT = this.apiUtils.make_response(menteeData);
    return response;
  }
}
