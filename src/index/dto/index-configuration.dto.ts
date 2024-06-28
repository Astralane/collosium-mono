import { Exclude, Expose } from 'class-transformer';

export class IndexConfigurationDTO {
  @Exclude()
  id?: number;

  @Exclude()
  table_name: string;

  @Expose()
  name: string;

  @Expose()
  index_id: string;

  @Expose()
  json_config: any;

  @Exclude()
  api_key: string;
}
