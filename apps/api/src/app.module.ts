import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { DatabaseModule } from './database.module';
import { usersProviders } from './users/users.providers';
import { ShowsModule } from './shows/shows.module';
import { SseModule } from './sse/sse.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '../../../.env'),
    }),
    DatabaseModule,
    SseModule,
    ShowsModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, ...usersProviders, UsersService],
})
export class AppModule {}
