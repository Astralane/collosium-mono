import { Controller, Get, Query } from '@nestjs/common';
import { IdlService } from './idl.service';

@Controller('idl')
export class IdlController {
  constructor(private readonly idlService: IdlService) {}

  @Get('download')
  async downloadIdl(
    @Query('programPubkey') programPubkey: string,
  ): Promise<string> {
    return this.idlService.downloadIdl(programPubkey);
  }

  @Get('store')
  async storeIdl(
    @Query('programPubkey') programPubkey: string,
    @Query('idl') idl: string,
  ): Promise<void> {
    return this.idlService.storeIdl(programPubkey, idl);
  }
}
