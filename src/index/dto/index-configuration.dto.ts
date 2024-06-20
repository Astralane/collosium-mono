import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class IndexConfigurationDTO {
  @HideField()
  id: number;

  @HideField()
  table_name: string;

  @Field({})
  index_id: string;

  @Field(() => GraphQLJSONObject)
  json_config: any;

  @HideField()
  last_updated_slot: string;

  @HideField()
  api_key: string;
}