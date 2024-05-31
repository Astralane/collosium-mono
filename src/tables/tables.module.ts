import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablesResolver } from './tables.resolver';
import { TablesService } from './tables.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [TablesService, TablesResolver],
})
export class TablesModule {}
