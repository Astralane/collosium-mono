import { Injectable } from '@nestjs/common';
import { Key } from './entities/key.entity';
import { CreateKeyDto } from './dto/create-key.dto';
import { generateKey } from 'src/utils/crypto.utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>,
  ) {}

  async create(createKeyDto: CreateKeyDto): Promise<Key> {
    const key = this.keyRepository.create(createKeyDto);
    return await this.keyRepository.save(key);
  }

  async generate(): Promise<Key> {
    const key = generateKey();
    const createKeyDto: CreateKeyDto = {
      key,
      rpsLimit: 1000,
    };

    const keyToSave = this.keyRepository.create(createKeyDto);
    return await this.keyRepository.save(keyToSave);
  }

  async getOne(key: string): Promise<Key> {
    return await this.keyRepository.findOne({ where: { key } });
  }

  async findAll(): Promise<Key[]> {
    return await this.keyRepository.find();
  }

  async delete(key: string): Promise<void> {
    await this.keyRepository.delete({ key });
  }
}
