import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Key } from './schemas/key.schema';
import { Model } from 'mongoose';
import { CreateKeyDto } from './dto/create-key.dto';
import { generateKey } from 'src/utils/crypto.utils';

@Injectable()
export class KeysService {
  constructor(@InjectModel(Key.name) private readonly keyModel: Model<Key>) {}

  async create(createKeyDto: CreateKeyDto): Promise<Key> {
    const key = new this.keyModel(createKeyDto);
    return await key.save();
  }

  async generate(): Promise<Key> {
    const key = generateKey();
    const createKeyDto: CreateKeyDto = {
      key,
      rpsLimit: 1000,
    };

    return await new this.keyModel(createKeyDto).save();
  }

  async getOne(key: string): Promise<Key> {
    return await this.keyModel.findOne({ key: key }).exec();
  }

  async findAll(): Promise<Key[]> {
    return await this.keyModel.find().exec();
  }
}
