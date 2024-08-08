import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import './tracing';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './providers/users.service';
import { DatabaseModule } from './database.module';
import { usersProviders } from './providers/users.providers';
import { ShowsModule } from './shows/shows.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '../../../.env'),
    }),
    DatabaseModule,
    ShowsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, ...usersProviders, UsersService],
})
export class AppModule {}
