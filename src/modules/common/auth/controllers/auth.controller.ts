import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { AuthService } from '../services/auth.service';
import { SignupDTO } from '../dto/signup.dto';
import { SignupResponseType } from '../types/signupResponse.type';
import { ApiResponseT } from '@utils/types';
import { LoginDTO } from '../dto/login.dto';

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDTO) {
    const data:SignupResponseType = await this.authService.login(loginDto);
    const response = this.apiUtils.make_response(data);
    return response;
  }

  @Post('/signup')
  async signup(@Body() signupDto: SignupDTO):Promise<ApiResponseT> {
    const data:SignupResponseType = await this.authService.signup(signupDto);
    const response:ApiResponseT = this.apiUtils.make_response(data);
    return response;
  }

}
