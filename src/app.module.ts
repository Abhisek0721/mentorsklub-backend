import { Module } from '@nestjs/common';
import { MentorModule } from '@modules/mentor/mentor.module';
import { MenteeModule } from '@modules/mentee/mentee.module';
import { UtilsModule } from '@utils/utils.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";
import { get_mongo_connection } from '@configs/dbConfig';
import { DATABASE_NAME } from './constants';
import { CommonModule } from '@modules/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(get_mongo_connection(), {
      connectionName: DATABASE_NAME,
      authSource: 'admin',
    }),
    CommonModule,
    MentorModule,
    MenteeModule,
    UtilsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
