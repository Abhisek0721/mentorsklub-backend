import { Controller, Get } from '@nestjs/common';
import { MentorUserService } from '@modules/mentor/mentor_user/services/mentorUser.service';
import { ApiUtilsService } from '@utils/utils.service';

@Controller()
export class MentorUserController {
  constructor(
    private readonly mentorUserService: MentorUserService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('/')
  async getAllUsers() {
    const users = await this.mentorUserService.getUser();
    const response = this.apiUtils.make_response(users);
    return response;
  }
}
