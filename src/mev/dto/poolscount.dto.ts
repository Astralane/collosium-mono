import { Expose } from 'class-transformer';

export class TPoolsCountDTO {
  @Expose()
  pool: string;
  @Expose()
  count: number;
}

export class TSandwichTotalDTO {
  @Expose()
  total: number;
}
