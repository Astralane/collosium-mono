import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DynamicGraphqlModule } from './dynamic-graphql/dynamic-graphql.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), './schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'mydatabase',
      synchronize: true,
      autoLoadEntities: true,
    }),
    DynamicGraphqlModule,
    TablesModule,
  ],
})
export class AppModule {}
