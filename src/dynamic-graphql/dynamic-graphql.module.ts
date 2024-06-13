import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicGraphqlService } from './dynamic-graphql.service';
import { DynamicGraphqlController } from './dynamic-graphql.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), AuthModule],
  providers: [DynamicGraphqlService],
  controllers: [DynamicGraphqlController],
})
export class DynamicGraphqlModule {}
