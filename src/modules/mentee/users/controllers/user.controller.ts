import { Controller, Get } from '@nestjs/common';
import { UserService } from '@modules/mentee/users/services/user.service';
import { ApiUtilsService } from '@utils/utils.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('/')
  async getAllUsers() {
    const users = await this.userService.getUser();
    const response = this.apiUtils.make_response(users);
    return response;
  }
}
