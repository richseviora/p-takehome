import { Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { showsProviders } from './shows.providers';
import { DatabaseModule } from '../database.module';
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [DatabaseModule, SseModule],
  controllers: [ShowsController],
  providers: [...showsProviders, ShowsService],
})
export class ShowsModule {}
