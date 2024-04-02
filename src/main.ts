import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestErrorFilter, HttpExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // for error handeling on receiving request
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new BadRequestErrorFilter());
  app.use(urlencoded({ limit: '200mb', extended: true }));

  // Increase multipart file upload limit to 10MB
  // app.use(json({ limit: '200mb' }));

  // Return "<h1> Running on port 3000 </h1>" for the root route
  // app.use('/', (req: Request, res: Response) => {
  //   res.send(`<h1> Running on port: ${ConstantEnv.PORT} </h1>`);
  // });

  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  await app.listen(process.env.PORT, '0.0.0.0', async () => {
    console.log(`Backend URL: ${await app.getUrl()}`);
  });
}
bootstrap();
