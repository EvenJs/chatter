import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger))
  // Enable CORS
  app.enableCors({
    origin: '*', // allow all origins (use specific domain in production)
    credentials: true, // if you're using cookies or HTTP auth
  });
  app.use(cookieParser())
  const configService = app.get(ConfigService)

  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
