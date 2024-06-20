import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexResolver } from './index.resolver';
import { IndexService } from './index.service';
import { AuthModule } from 'src/auth/auth.module';
import { IndexConfiguration } from './entity/index-configuration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndexConfiguration]), AuthModule],
  providers: [IndexService, IndexResolver],
})
export class IndexModule {}
