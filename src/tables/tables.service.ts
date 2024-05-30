import { Injectable } from '@nestjs/common';
import { TableDTO } from './dto/table.dto';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class TablesService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async getTables(): Promise<TableDTO[]> {
    const query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public'
        AND table_type='BASE TABLE';
      `;
    const result = await this.connection.query(query);
    return result.map((row) => ({ tableName: row.table_name }));
  }
}
