import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { IndexService } from './index.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { IndexConfigurationDTO } from './dto/index-configuration.dto';
import { CreateIndexDTO } from './dto/create-index.dto';

@Controller('index')
@UseGuards(AuthGuard)
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get()
  async getIndexes(@Req() req: Request): Promise<IndexConfigurationDTO[]> {
    const apiKey = req.headers['x-api-key'] as string;
    return this.indexService.getIndexes(apiKey);
  }

  @Post()
  async createIndex(
    @Body() createIndexDto: CreateIndexDTO,
    @Req() req: Request,
  ): Promise<any> {
    const apiKey = req.headers['x-api-key'] as string;
    const indexId = await this.indexService.createIndex(createIndexDto, apiKey);
    return {
      message: 'Index was created',
      id: indexId,
    };
  }
}
