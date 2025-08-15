import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Leer puerto desde variable de entorno o fallback a 3001
  const port = Number(process.env.USERS_SERVICE_PORT) || 3001;

  await app.listen(port);

  const logger = new Logger('UsersService');
  logger.log(`User service listening on HTTP port ${port}`);
}

bootstrap();
