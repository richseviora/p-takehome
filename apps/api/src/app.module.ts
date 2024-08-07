import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import './tracing';
import { User } from './entities/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '../../../.env'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'local-dev.sql',
      synchronize: true,
      logging: true,
      entities: [User],
      subscribers: [],
      migrations: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
