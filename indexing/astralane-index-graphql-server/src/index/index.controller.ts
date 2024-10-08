import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { IndexService } from './index.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { IndexConfigurationDTO } from './dto/index-configuration.dto';

@Controller('index')
@UseGuards(AuthGuard)
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get()
  async getIndexes(@Req() req: Request): Promise<IndexConfigurationDTO[]> {
    const apiKey = req.headers['x-api-key'] as string;
    return this.indexService.getIndexes(apiKey);
  }
}
