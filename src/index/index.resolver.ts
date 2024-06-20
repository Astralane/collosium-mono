import { Context, Query, Resolver } from '@nestjs/graphql';
import { IndexService } from './index.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { IndexConfigurationDTO } from './dto/index-configuration.dto';

@UseGuards(AuthGuard)
@Resolver(() => IndexConfigurationDTO)
export class IndexResolver {
  constructor(private readonly indexService: IndexService) {}

  @Query(() => [IndexConfigurationDTO])
  async indexes(@Context() context: any): Promise<IndexConfigurationDTO[]> {
    const req = context.req;
    const key = req.headers['x-api-key'];

    return this.indexService.getIndexes(key);
  }
}
