import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTracing } from './tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initializeTracing();
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
