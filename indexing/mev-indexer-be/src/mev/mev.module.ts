import { Module } from '@nestjs/common';
import { ClickhouseModule } from 'src/clickhouse/clickhouse.module';
import { MevService } from './mev.service';
import { MevController } from './mev.controller';

@Module({
  imports: [ClickhouseModule],
  providers: [MevService],
  controllers: [MevController],
})
export class MevModule {}
