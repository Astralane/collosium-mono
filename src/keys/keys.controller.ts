import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  async create(@Body() createKeyDto: CreateKeyDto) {
    return await this.keysService.create(createKeyDto);
  }

  @Post('generate')
  async generate() {
    return await this.keysService.generate();
  }

  @Get(':keyValue')
  async findOne(@Param('keyValue') keyValue: string) {
    const key = await this.keysService.getOne(keyValue);
    if (!key) {
      throw new NotFoundException('Key is not found.');
    }
    return key;
  }

  @Get()
  async findAll() {
    return await this.keysService.findAll();
  }
}
