import { Controller, Get, Post } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Post('/login')
  async mentorLogin() {
    // const users = await this.userService.getUser();
    // const response = this.apiUtils.make_response(users);
    // return response;
  }

  @Post('/signup')
  async mentorSignup() {
    // const users = await this.userService.getUser();
    // const response = this.apiUtils.make_response(users);
    // return response;
  }

}
