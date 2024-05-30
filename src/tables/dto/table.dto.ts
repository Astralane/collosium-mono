import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TableDTO {
  @Field()
  tableName: string;
}
