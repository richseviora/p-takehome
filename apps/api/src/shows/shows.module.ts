import { Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { showsProviders } from './shows.providers';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ShowsController],
  providers: [...showsProviders, ShowsService],
})
export class ShowsModule {}
