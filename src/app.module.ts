import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import clickhouseConfig from './config/clickhouse.config';
import { MevModule } from './mev/mev.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [clickhouseConfig],
    }),
    MevModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
