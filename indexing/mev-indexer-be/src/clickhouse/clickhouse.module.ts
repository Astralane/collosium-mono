import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { clickhouseProvider } from 'src/config/clickhouse.config';
import { DatabaseConnectionCheckerService } from './db-connection-checker.service';

@Module({
  imports: [ConfigModule],
  providers: [clickhouseProvider, DatabaseConnectionCheckerService],
  exports: [clickhouseProvider],
})
export class ClickhouseModule {}
