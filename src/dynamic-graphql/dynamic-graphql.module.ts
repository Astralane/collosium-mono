import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicGraphqlService } from './dynamic-graphql.service';
import { DynamicGraphqlController } from './dynamic-graphql.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [DynamicGraphqlService],
  controllers: [DynamicGraphqlController],
})
export class DynamicGraphqlModule {}
