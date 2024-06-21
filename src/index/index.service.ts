import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndexConfiguration } from './entity/index-configuration.entity';
import { IndexConfigurationDTO } from './dto/index-configuration.dto';
import { config } from 'dotenv';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class IndexService {
  constructor(
    @InjectRepository(IndexConfiguration)
    private readonly indexConfigurationRepository: Repository<IndexConfiguration>,
  ) {}

  async getIndexes(key: string): Promise<IndexConfigurationDTO[]> {
    const indexes = await this.indexConfigurationRepository.findBy([{
      api_key: key
    }]);
    const formattedIndexes = indexes.map(index => ({
      ...index,
      json_config: JSON.parse(index.json_config)
    }))

    return plainToInstance(IndexConfigurationDTO, formattedIndexes, { excludeExtraneousValues: true });
  }
}
