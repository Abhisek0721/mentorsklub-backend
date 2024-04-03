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
import { MentorUserService } from '@modules/mentor/mentor_user/services/mentorUser.service';
import { ApiPageUtils, ApiUtilsService } from '@utils/utils.service';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { IAuthRequest } from '@utils/interfaces';
import { ApiResponseT, PageT } from '@utils/types';
import { Roles } from '@modules/common/auth/decorators/role.decorator';
import { RoleGuard } from '@modules/common/auth/services/role.guard';
import { ROLES } from '@constants/index';
import { AvailabilityTimeDTO, MentorDTO } from '../dto/mentor.dto';
import { Mentor } from '../models/mentor.model';

@Controller()
export class MentorUserController {
  constructor(
    private readonly mentorUserService: MentorUserService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTOR)
  async getMentor(@Req() req: IAuthRequest): Promise<ApiResponseT> {
    const userId = req.user.userId;
    const mentorData = await this.mentorUserService.getMentorData(userId);
    const response: ApiResponseT = this.apiUtils.make_response(mentorData);
    return response;
  }

  @Get('/all-mentors')
  @UseGuards(JwtAuthGuard)
  async getAllMentors(
    @Query('pageNumber') pageNumber: number,
    @Query('limit') limit: number,
  ): Promise<ApiResponseT> {
    const data = await this.mentorUserService.getAllMentorData(
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

  @Put('/updateMentor')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTOR)
  async updateMentor(
    @Req() req: IAuthRequest,
    @Body() mentorDto: MentorDTO,
  ): Promise<ApiResponseT> {
    const userId = req.user.userId;
    const data: Mentor = await this.mentorUserService.updateMentor(
      userId,
      mentorDto,
    );
    return this.apiUtils.make_response(data);
  }

  @Patch('/updateAvailabilityTime')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLES.MENTOR)
  async updateAvailabilityTime(
    @Req() req: IAuthRequest,
    @Body() availabilityTime: AvailabilityTimeDTO,
  ): Promise<ApiResponseT> {
    const userId = req.user.userId;
    const data: Mentor = await this.mentorUserService.updateAvailabilityTime(
      userId,
      availabilityTime,
    );
    return this.apiUtils.make_response(data);
  }
}
