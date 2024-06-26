import {
  IsArray,
  IsEnum,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CustomColumnValidator } from '../validator/column.validator';
import { IsProgramIdPredicate } from '../validator/program-id-predicate.validator';

export class CreateIndexDTO {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @Validate(CustomColumnValidator, {
    each: true,
    message:
      'Invalid column name. Must be one of the standard columns or match a pattern.',
  })
  columns: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IndexFilter)
  filters: IndexFilter[];
}

export class IndexFilter {
  @IsString()
  column: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IndexFilterPredicate)
  @IsProgramIdPredicate({
    each: true,
    message: 'Predicate type for "program_id" must be "eq".',
  })
  predicates: IndexFilterPredicate[];
}

export enum PredicateType {
  LT = 'lt',
  GT = 'gt',
  EQ = 'eq',
  IN = 'in',
  CONTAINS = 'contains',
}

export class IndexFilterPredicate {
  @IsEnum(PredicateType, { each: true, always: true })
  type: PredicateType;

  value: any[];
}
