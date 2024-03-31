import { Module } from '@nestjs/common';
import { MentorModule } from '@modules/mentor/mentor.module';
import { MenteeModule } from '@modules/mentee/mentee.module';
import { UtilsModule } from '@utils/utils.module';

@Module({
  imports: [
    MentorModule,
    MenteeModule,
    UtilsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
