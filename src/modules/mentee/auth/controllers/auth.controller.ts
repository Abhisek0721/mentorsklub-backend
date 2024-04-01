import { Controller, Get } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Get('/')
  async getAllUsers() {
    const users = await this.authService.login();
    const response = this.apiUtils.make_response(users);
    return response;
  }
}
