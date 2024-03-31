import { Module } from '@nestjs/common';
import { UserController } from '@modules/mentee/users/controllers/user.controller';
import { UserService } from '@modules/mentee/users/services/user.service';

@Module({
    controllers: [UserController],
    providers: [UserService]
})
export class UsersModule {}
