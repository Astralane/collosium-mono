import { Module } from '@nestjs/common';
import { IdlService } from './idl.service';
import { IdlController } from './idl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idl } from './entity/idl.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idl])],
  providers: [IdlService],
  controllers: [IdlController],
  exports: [IdlService],
})
export class IdlModule {}
