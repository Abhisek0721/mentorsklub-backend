import { Module } from '@nestjs/common';
import { AuthModule } from "@modules/auth/auth.module";
import { UsersModule } from "@modules/users/users.module";
import { UtilsModule } from '@utils/utils.module';


@Module({
  imports: [AuthModule, UsersModule, UtilsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
