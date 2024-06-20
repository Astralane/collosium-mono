import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';

@Injectable()
export class DynamicGraphqlService {
  private readonly logger = new Logger(DynamicGraphqlService.name);

  constructor(@InjectDataSource() private readonly connection: DataSource) {}

  async generateSchema(
    id: string,
    offset: number,
    limit: number,
  ): Promise<GraphQLSchema> {
    const tableName = await this.getTableNameById(id);
    if (!tableName) {
      this.logger.error(`Table not found for id ${id}`);
      throw new Error('Table not found');
    }

    const columns = await this.getTableColumns(tableName);
    if (columns.length === 0) {
      this.logger.error(`No columns found for table ${tableName}`);
      throw new Error('Table not found or no columns defined');
    }

    const typeDefs = this.createTypeDefs(tableName, columns);
    const resolvers = this.createResolvers(tableName, offset, limit);

    return makeExecutableSchema({ typeDefs, resolvers });
  }

  private async getTableColumns(tableName: string): Promise<any[]> {
    const query = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
    `;
    const result = await this.connection.query(query, [tableName]);
    return result;
  }

  private createTypeDefs(tableName: string, columns: any[]): string {
    const fields = columns
      .map((column) => {
        const graphqlType = this.mapColumnTypeToGraphQL(column.data_type);
        return `${column.column_name}: ${graphqlType}`;
      })
      .join('\n');

    return `
      type SolanaInstruction {
        ${fields}
      }

      type Query {
        solana_instructions(
          limit: Int,
          page: Int
        ): [SolanaInstruction]
      }

      schema {
        query: Query
      }
    `;
  }

  private mapColumnTypeToGraphQL(columnType: string): string {
    switch (columnType) {
      case 'integer':
        return 'Int';
      case 'text':
      case 'varchar':
        return 'String';
      case 'boolean':
        return 'Boolean';
      case 'ARRAY':
        return '[String]';
      default:
        return 'String';
    }
  }

  private createResolvers(
    tableName: string,
    offset: number,
    limit: number,
  ): any {
    return {
      Query: {
        solana_instructions: async (_, args) => {
          const whereClauses = Object.keys(args)
            .filter((key) => key !== 'limit' && key !== 'page')
            .map((key) => `${key} = '${args[key]}'`)
            .join(' AND ');

          const query = `
            SELECT * 
            FROM ${tableName} 
            ${whereClauses ? `WHERE ${whereClauses}` : ''}
            LIMIT ${limit} OFFSET ${offset}
          `;

          return await this.connection.query(query);
        },
      },
    };
  }

  private async getTableNameById(id: string): Promise<string | null> {
    const query = `
      SELECT table_name
      FROM index_configuration
      WHERE index_id = $1
    `;
    const result = await this.connection.query(query, [id]);
    return result.length ? result[0].table_name : null;
  }
}
