import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
