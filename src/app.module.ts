import { Module } from '@nestjs/common';
import { KeysModule } from './keys/keys.module';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';

dotenv.config();

@Module({
  imports: [KeysModule, MongooseModule.forRoot(process.env.MONGODB_URL)],
})
export class AppModule {}
