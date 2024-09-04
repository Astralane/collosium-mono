import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ISandwichesDTO } from './dto/sandwiches.dto';
import { MevService } from './mev.service';
import { TPoolsCountDTO, TSandwichTotalDTO } from './dto/poolscount.dto';

@Controller('mev')
export class MevController {
  constructor(private readonly mevService: MevService) {}
  @Get('/sandwiches')
  async getAllSandwiches(): Promise<ISandwichesDTO[]> {
    return await this.mevService.fetchDataFromSandwichesTable();
  }

  @Get('/pools/count')
  async getPoolsCount(): Promise<TPoolsCountDTO[]> {
    return await this.mevService.fetchAggreatedPoolsData();
  }
  @Get('/total/sandwiches')
  async getTotalSandwiches(): Promise<TSandwichTotalDTO> {
    return await this.mevService.fetchTotalSandwiches();
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
