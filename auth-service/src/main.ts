import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // HTTP REST

  // Leer puerto desde variable de entorno y convertir a número
  const port = Number(process.env.AUTH_SERVICE_PORT) || 3000;

  await app.listen(port);

  const logger = new Logger('AuthService');
  logger.log(`Auth service listening on HTTP port ${port}`);
}

bootstrap();
