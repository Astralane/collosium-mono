import { ClickHouseClient } from '@clickhouse/client';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ISandwichesDTO } from './dto/sandwiches.dto';
import { plainToInstance } from 'class-transformer';
import {
  TSandwichTotalDTO,
  TPoolsCountDTO,
  TProgramsCountDTO,
  TTotalCountsDTO,
  TTokensCountDTO,
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
        'SELECT pool, COUNT(pool) AS count FROM (SELECT arrayJoin(arrayConcat(`backrun_swaps.pool_address`, `frontrun_swaps.pool_address`,`victim_swaps.pool_address`)) AS pool FROM sandwiches) AS s GROUP BY pool ORDER BY count DESC;';
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
        "SELECT program, SUM(count) AS total_count FROM (SELECT program, COUNT(program) AS count FROM (SELECT arrayJoin(arrayConcat(arrayFilter(x -> x != '', `frontrun_swaps.inner_program`), arrayFilter(x -> x != '', `frontrun_swaps.outer_program`))) AS program FROM sandwiches) AS s GROUP BY program UNION ALL SELECT program, COUNT(program) AS count FROM (SELECT arrayJoin(arrayConcat(arrayFilter(x -> x != '', `backrun_swaps.inner_program`), arrayFilter(x -> x != '', `backrun_swaps.outer_program`))) AS program FROM sandwiches) AS s GROUP BY program UNION ALL SELECT program, COUNT(program) AS count FROM (SELECT arrayJoin(arrayConcat(arrayFilter(x -> x != '', `victim_swaps.inner_program`), arrayFilter(x -> x != '', `victim_swaps.outer_program`))) AS program FROM sandwiches) AS s GROUP BY program) AS combined_results GROUP BY program ORDER BY total_count DESC;";
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

  async fecthTotalCounts(): Promise<TTotalCountsDTO> {
    try {
      const query =
        'SELECT original.total_rows AS original_count, expanded.total_attackers, expanded.total_victims FROM (SELECT COUNT(*) AS total_rows FROM sandwiches) AS original,(SELECT COUNT(DISTINCT arrayJoin(`frontrun_swaps.signer`)) AS total_attackers, COUNT(DISTINCT arrayJoin(`victim_swaps.signer`)) AS total_victims FROM sandwiches) AS expanded;';
      const result = await this.clickhouseClient.query({
        query,
        format: 'JSON',
      });
      const data = (await result.json()).data;
      return data[0] as unknown as TTotalCountsDTO;
    } catch (error) {
      throw new Error('Failed to fetch total counts');
    }
  }

  async fetchSandwichesByProgram(program: string): Promise<ISandwichesDTO> {
    try {
      const query = `SELECT * from sandwiches WHERE frontrun_tx_id = '${program}';`;
      const result = await this.clickhouseClient.query({
        query,
        format: 'JSON',
      });
      const data = (await result.json()).data;
      return data[0] as unknown as ISandwichesDTO;
    } catch (error) {
      throw new Error('Failed to fetch sandwiches by program');
    }
  }

  async fetchAggreatedTokensCount(): Promise<TTokensCountDTO[]> {
    try {
      const query =
        "SELECT token, SUM(count) AS total_count FROM (SELECT token, COUNT(token) AS count FROM (SELECT arrayJoin(arrayConcat(arrayFilter(x -> x != '', `frontrun_swaps.token_in`), arrayFilter(x -> x != '', `frontrun_swaps.token_out`))) AS token FROM sandwiches) AS s GROUP BY token UNION ALL SELECT token, COUNT(token) AS count FROM (SELECT arrayJoin(arrayConcat(arrayFilter(x -> x != '', `backrun_swaps.token_in`), arrayFilter(x -> x != '', `backrun_swaps.token_out`))) AS token FROM sandwiches) AS s GROUP BY token UNION ALL SELECT token, COUNT(token) AS count FROM (SELECT arrayJoin(arrayConcat(arrayFilter(x -> x != '', `victim_swaps.token_in`), arrayFilter(x -> x != '', `victim_swaps.token_out`))) AS token FROM sandwiches) AS s GROUP BY token) AS combined_results GROUP BY token ORDER BY total_count DESC;";
      const result = await this.clickhouseClient.query({
        query,
        format: 'JSON',
      });
      const data = (await result.json()).data;
      return plainToInstance(TTokensCountDTO, data, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      // Handle error
      throw new Error('Failed to fetch tokens count from the table');
    }
  }
}
