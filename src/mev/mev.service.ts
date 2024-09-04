import { ClickHouseClient } from '@clickhouse/client';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ISandwichesDTO } from './dto/sandwiches.dto';
import { plainToInstance } from 'class-transformer';
import {
  TSandwichTotalDTO,
  TPoolsCountDTO,
  TProgramsCountDTO,
} from './dto/poolscount.dto';

@Injectable()
export class MevService {
  private readonly logger = new Logger(MevService.name);
  constructor(
    @Inject('CLICKHOUSE_CLIENT')
    private readonly clickhouseClient: ClickHouseClient,
  ) {}

  async fetchDataFromSandwichesTable(
    limit: number,
    offset: number,
  ): Promise<ISandwichesDTO[]> {
    try {
      const query = `SELECT * FROM sandwiches LIMIT ${limit} OFFSET ${offset};`;
      const result = await this.clickhouseClient.query({
        query,
        format: 'JSON',
      });
      const data = (await result.json()).data;
      return plainToInstance(ISandwichesDTO, data, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      // Handle error
      throw new Error('Failed to fetch data from sandwiches table');
    }
  }

  async fetchAggreatedPoolsData(): Promise<TPoolsCountDTO[]> {
    try {
      const query =
        'SELECT pool, COUNT(pool) AS count FROM (SELECT arrayJoin(`backrun_swaps.pool`) AS pool FROM sandwiches) AS s GROUP BY pool ORDER BY count DESC;';
      const result = await this.clickhouseClient.query({
        query,
        format: 'JSON',
      });
      const data = (await result.json()).data;
      return plainToInstance(TPoolsCountDTO, data, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      // Handle error
      throw new Error('Failed to fetch data from pools table');
    }
  }
  async fetchTotalSandwiches(): Promise<TSandwichTotalDTO> {
    try {
      const query = 'SELECT COUNT(*) AS total FROM sandwiches;';
      const result = await this.clickhouseClient.query({
        query,
        format: 'JSON',
      });
      const data = (await result.json())
        .data[0] as unknown as TSandwichTotalDTO;
      if (data) {
        return data;
      } else {
        throw new Error('No data found');
      }
    } catch (error) {
      // Handle error
      throw new Error('Failed to fetch total sandwiches');
    }
  }

  async fetchAggreatedProgramsCount(): Promise<TProgramsCountDTO[]> {
    try {
      const query =
        "SELECT program, COUNT(program) AS count FROM (SELECT arrayJoin(arrayConcat(`frontrun_swaps.inner_program`, `frontrun_swaps.outer_program`, `backrun_swaps.inner_program`,`backrun_swaps.outer_program`,`victim_swaps.outer_program`,`victim_swaps.inner_program`)) AS program FROM sandwiches) AS s WHERE program != ' ' GROUP BY program ORDER BY count DESC;";
      const result = await this.clickhouseClient.query({
        query,
        format: 'JSON',
      });
      const data = (await result.json()).data;
      return plainToInstance(TProgramsCountDTO, data, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      // Handle error
      throw new Error('Failed to fetch program count from the table');
    }
  }
}
