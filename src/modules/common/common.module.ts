import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { MessageModule } from './messages/message.module';


@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    MessageModule
  ],
  controllers: [],
  providers: [],
})
export class CommonModule {}
