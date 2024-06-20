import { Context, Query, Resolver } from '@nestjs/graphql';
import { IndexService } from './index.service';
import { IndexConfigurationDTO } from './dto/index-configuration.dto';

@Resolver(() => IndexConfigurationDTO)
export class IndexResolver {
  constructor(private readonly indexService: IndexService) {}

  @Query(() => [String])
  async indexes(@Context() context: any): Promise<string> {
    const req = context.req;
    const key = req.headers['x-api-key'];

    return 'Index'
  }
}
