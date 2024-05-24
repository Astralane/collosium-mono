import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type KeyDocument = HydratedDocument<Key>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Key extends Document {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  rpsLimit: number;
}

export const KeySchema = SchemaFactory.createForClass(Key);
