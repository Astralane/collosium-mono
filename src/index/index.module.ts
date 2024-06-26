import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexService } from './index.service';
import { IndexConfiguration } from './entity/index-configuration.entity';
import { IndexController } from './index.controller';
import { KeysModule } from 'src/keys/keys.module';
import { IdlModule } from 'src/idl/idl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IndexConfiguration]),
    KeysModule,
    IdlModule,
  ],
  providers: [IndexService],
  controllers: [IndexController],
})
export class IndexModule {}
