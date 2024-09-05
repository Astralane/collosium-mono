import { Controller, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { ISandwichesDTO } from './dto/sandwiches.dto';
import { MevService } from './mev.service';
import {
  TPoolsCountDTO,
  TProgramsCountDTO,
  TSandwichTotalDTO,
  TTokensCountDTO,
  TTotalCountsDTO,
} from './dto/poolscount.dto';

@Controller('mev')
export class MevController {
  constructor(private readonly mevService: MevService) {}
  @Get('/sandwiches')
  async getAllSandwiches(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ): Promise<ISandwichesDTO[]> {
    const limitValue = parseInt(limit, 10) || 10; // Default limit is 10 if not provided
    const offsetValue = parseInt(offset, 10) || 0; // Default offset is 0 if not provided

    return await this.mevService.fetchDataFromSandwichesTable(
      limitValue,
      offsetValue,
    );
  }

  @Get('/pools/count')
  async getPoolsCount(): Promise<TPoolsCountDTO[]> {
    return await this.mevService.fetchAggreatedPoolsData();
  }
  @Get('/total/sandwiches')
  async getTotalSandwiches(): Promise<TSandwichTotalDTO> {
    return await this.mevService.fetchTotalSandwiches();
  }
  @Get('/programs/count')
  async getProgramsCount(): Promise<TProgramsCountDTO[]> {
    return await this.mevService.fetchAggreatedProgramsCount();
  }

  @Get('/tokens/count')
  async getTokensCount(): Promise<TTokensCountDTO[]> {
    return await this.mevService.fetchAggreatedTokensCount();
  }

  @Get('/totalCounts')
  async getTotalCounts(): Promise<TTotalCountsDTO> {
    return await this.mevService.fecthTotalCounts();
  }

  @Get('/sandwich')
  async getSandwichByTxId(
    @Query('tx_id') tx_id: string,
  ): Promise<ISandwichesDTO> {
    return await this.mevService.fetchSandwichesByProgram(tx_id);
  }
  @Post()
  create(): string {
    return 'This is the POST endpoint for /mev';
  }

  @Put()
  update(): string {
    return 'This is the PUT endpoint for /mev';
  }

  @Delete()
  remove(): string {
    return 'This is the DELETE endpoint for /mev';
  }
}
