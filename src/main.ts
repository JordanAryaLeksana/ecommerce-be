import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
// import { AccessTokenAuth } from './common/Accesstoken.auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // frontend URL kamu
    credentials: true,               // kalau pakai cookie/session
  });
  const logger: LoggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  await app.listen(8000);
}
bootstrap();
