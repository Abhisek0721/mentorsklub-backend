import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(urlencoded({ limit: '200mb', extended: true }));

  // Increase multipart file upload limit to 10MB
  // app.use(json({ limit: '200mb' }));

  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
