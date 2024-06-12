import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  if (process.listenerCount('SIGINT') === 0) {
    process.on('SIGINT', async () => {
      await app.close();
      process.exit(0);
    });
  }

  if (process.listenerCount('SIGTERM') === 0) {
    process.on('SIGTERM', async () => {
      await app.close();
      process.exit(0);
    });
  }

  await app.listen(3000);
}
bootstrap();
