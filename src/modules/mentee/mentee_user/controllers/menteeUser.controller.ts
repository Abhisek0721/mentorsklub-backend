import { Controller, Get } from '@nestjs/common';
import { MenteeUserService } from '@modules/mentee/mentee_user/services/menteeUser.service';
import { ApiUtilsService } from '@utils/utils.service';

@Controller()
export class MenteeUserController {
  constructor(
    private readonly menteeUserService: MenteeUserService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('/')
  async getAllUsers() {
    const users = await this.menteeUserService.getUser();
    const response = this.apiUtils.make_response(users);
    return response;
  }
}
