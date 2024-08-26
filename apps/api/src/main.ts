import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTracing } from './tracing';

async function bootstrap() {
  initializeTracing();
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
