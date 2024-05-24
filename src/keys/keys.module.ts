import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Key, KeySchema } from './schemas/key.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Key.name, schema: KeySchema }])],
  providers: [KeysService],
  controllers: [KeysController],
})
export class KeysModule {}
