import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import ConstantEnv from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(urlencoded({ limit: '200mb', extended: true }));

  // Increase multipart file upload limit to 10MB
  // app.use(json({ limit: '200mb' }));

  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  // Return "<h1> Running on port 3000 </h1>" for the root route
  app.use('/', (req: Request, res: Response) => {
    res.send(`<h1> Running on port: ${ConstantEnv.PORT} </h1>`);
  });

  await app.listen(ConstantEnv.PORT, "0.0.0.0", async () => {
    console.log(`Backend URL: ${await app.getUrl()}`)
  });
}
bootstrap();
