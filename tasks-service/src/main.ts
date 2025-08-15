import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './tasks.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.TASKS_SERVICE_PORT) || 3002;

  await app.listen(port);

  const logger = new Logger('TasksService');
  logger.log(`Tasks service listening on HTTP port ${port}`);
}

bootstrap();
