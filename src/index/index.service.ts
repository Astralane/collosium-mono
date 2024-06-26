import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { IndexConfiguration } from './entity/index-configuration.entity';
import { IndexConfigurationDTO } from './dto/index-configuration.dto';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { CreateIndexDTO, IndexFilter } from './dto/create-index.dto';
import { IdlService } from 'src/idl/idl.service';
import { isCustomColumn } from './constants/columns';

@Injectable()
export class IndexService {
  private readonly logger = new Logger(IndexService.name);

  constructor(
    @InjectRepository(IndexConfiguration)
    private readonly indexConfigurationRepository: Repository<IndexConfiguration>,
    private readonly dataSource: DataSource,
    private readonly idlService: IdlService,
  ) {}

  async getIndexes(key: string): Promise<IndexConfigurationDTO[]> {
    const indexes = await this.indexConfigurationRepository.findBy([
      {
        api_key: key,
      },
    ]);

    return plainToInstance(IndexConfigurationDTO, indexes, {
      excludeExtraneousValues: true,
    });
  }

  async createIndex(
    createIndexDto: CreateIndexDTO,
    apiKey: string,
  ): Promise<string> {
    const programIdFilter = createIndexDto.filters.find(
      (filter) => filter.column === 'program_id',
    );
    if (programIdFilter) {
      await this.handleIdl(programIdFilter);
    }

    createIndexDto.columns.forEach((column) => {
      if (isCustomColumn(column)) {
        throw new BadRequestException(`Invalid column name: ${column}`);
      }
    });

    const indexId = uuidv4();
    const tableName = `index_${indexId.replaceAll('-', '_')}`;
    const indexConfigurationDto: IndexConfigurationDTO = {
      table_name: tableName,
      name: createIndexDto.name,
      index_id: indexId,
      json_config: { table_name: tableName, ...createIndexDto },
      api_key: apiKey,
    };
    await this.addIndexConfiguration(indexConfigurationDto);
    await this.createTable(tableName, createIndexDto.columns);

    return indexId;
  }

  private async createTable(
    tableName: string,
    columns: string[],
  ): Promise<void> {
    const columnsDefinitions = columns
      .map((column) => `${column} text`)
      .join(', ');
    const query = `CREATE TABLE ${tableName} (${columnsDefinitions})`;
    await this.dataSource.query(query);
  }

  private async addIndexConfiguration(
    indexConfigurationDto: IndexConfigurationDTO,
  ) {
    const config = this.indexConfigurationRepository.create(
      indexConfigurationDto,
    );
    return await this.indexConfigurationRepository.save(config);
  }

  private async handleIdl(programIdFilter: IndexFilter): Promise<void> {
    const programPubkey = programIdFilter.predicates[0].value[0];
    if (programPubkey === '11111111111111111111111111111111') {
      return;
    }
    this.logger.log(`Downloading IDL for program pubkey: ${programPubkey}`);
    const idl = await this.idlService.downloadIdl(programPubkey);
    if (!idl) {
      throw new BadRequestException(
        `Could not download IDL for ${programPubkey} program pubkey`,
      );
    }
    this.logger.log(`Storing IDL for program pubkey: ${programPubkey}`);
    await this.idlService.storeIdl(programPubkey, idl);
  }
}
