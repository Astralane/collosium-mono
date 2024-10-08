import { Module } from '@nestjs/common';
import { KeysModule } from './keys/keys.module';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexModule } from './index/index.module';
import { IdlModule } from './idl/idl.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    KeysModule,
    IndexModule,
    IdlModule,
  ],
})
export class AppModule {}
