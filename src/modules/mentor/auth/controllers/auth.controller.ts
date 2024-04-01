import { Controller, Get } from '@nestjs/common';
import { MentorUserService } from '@modules/mentor/mentor_user/services/mentorUser.service';
import { ApiUtilsService } from '@utils/utils.service';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: MentorUserService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('/')
  async getAllUsers() {
    const users = await this.userService.getUser();
    const response = this.apiUtils.make_response(users);
    return response;
  }
}
