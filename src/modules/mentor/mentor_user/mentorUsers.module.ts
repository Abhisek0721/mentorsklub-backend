import { Module } from '@nestjs/common';
import { MentorUserController } from './controllers/mentorUser.controller';
import { MentorUserService } from './services/mentorUser.service';

@Module({
    controllers: [MentorUserController],
    providers: [MentorUserService]
})
export class MentorUsersModule {}
