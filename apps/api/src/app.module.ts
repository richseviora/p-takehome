import { Module } from '@nestjs/common';
import * as path from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { ShowsModule } from './shows/shows.module';
import { SseModule } from './sse/sse.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '../../../.env'),
    }),
    EventEmitterModule.forRoot({}),
    SseModule,
    DatabaseModule,
    ShowsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
