import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import {
  BadRequestErrorFilter,
  ForbiddenExceptionFilter,
  HttpExceptionFilter,
  UnauthorizedExceptionFilter,
} from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // for error handeling on receiving request
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new BadRequestErrorFilter());
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  app.use(urlencoded({ limit: '200mb', extended: true }));

  // Increase multipart file upload limit to 10MB
  // app.use(json({ limit: '200mb' }));

  app.setGlobalPrefix('/api', { exclude: ['/'] });
  app.enableShutdownHooks();

  await app.listen(process.env.PORT, '0.0.0.0', async () => {
    console.log(`Backend URL: ${await app.getUrl()}`);
  });
}
bootstrap();
