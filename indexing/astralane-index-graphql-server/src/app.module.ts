import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DynamicGraphqlModule } from './dynamic-graphql/dynamic-graphql.module';
import { configDotenv } from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { IndexModule } from './index/index.module';

configDotenv();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), './schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER_NAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
    }),
    DynamicGraphqlModule,
    IndexModule,
    AuthModule,
  ],
})
export class AppModule {}
