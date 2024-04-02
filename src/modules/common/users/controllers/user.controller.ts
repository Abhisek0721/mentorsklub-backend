import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { ApiResponseT } from '@utils/types';
import { ChangePasswordDTO } from '../dto/changePassword.dto';
import { JwtAuthGuard } from '@modules/common/auth/services/jwt.auth.guard';
import { IAuthRequest } from '@utils/interfaces';
import { UserService } from '../services/user.service';
import { UpdateWriteOpResult } from 'mongoose';
import { EditUserDTO } from '../dto/editUser.dto';
import { User } from '../models/users.model';


@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly apiUtils: ApiUtilsService,
  ) {}

  @Patch("change-password")
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req: IAuthRequest, @Body() changePasswordDto:ChangePasswordDTO) {
    const userId = req.user.userId;
    const output:UpdateWriteOpResult = await this.userService.changePassword(changePasswordDto, userId);
    const response:ApiResponseT = this.apiUtils.make_response(output, "Password has been updated!");
    return response;
  }

  @Patch("edit-user")
  @UseGuards(JwtAuthGuard)
  async editUser(@Req() req: IAuthRequest, @Body() editUserDto:EditUserDTO) {
    const userId = req.user.userId;
    const output:User = await this.userService.editUser(editUserDto, userId);
    const response:ApiResponseT = this.apiUtils.make_response(output, "User profile has been updated!");
    return response;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserById(@Req() req: IAuthRequest):Promise<ApiResponseT> {
    const user:User = await this.userService.getUserById(req.user.userId);
    const response:ApiResponseT = this.apiUtils.make_response(user);
    return response;
  }
}
