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

export class TProgramsCountDTO {
  @Expose()
  program: string;
  @Expose()
  total_count: number;
}

export class TTotalCountsDTO {
  original_count: number;
  total_attackers: number;
  total_victims: number;
}

export class TTokensCountDTO {
  @Expose()
  token: string;
  @Expose()
  total_count: number;
}
