import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { SseController } from './sse.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SseController],
})
export class SseModule {}
