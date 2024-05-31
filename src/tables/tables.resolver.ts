import { Query, Resolver } from '@nestjs/graphql';
import { TableDTO } from './dto/table.dto';
import { TablesService } from './tables.service';

@Resolver()
export class TablesResolver {
  constructor(private readonly tablesService: TablesService) {}

  @Query(() => [TableDTO])
  async getTables(): Promise<TableDTO[]> {
    return this.tablesService.getTables();
  }
}
