import {
  Controller,
  Post,
  Param,
  Req,
  Res,
  Next,
  Logger,
} from '@nestjs/common';
import { DynamicGraphqlService } from './dynamic-graphql.service';
import { ApolloServer } from 'apollo-server-express';
import { Request, Response, NextFunction } from 'express';

@Controller('api/v1/dataset')
export class DynamicGraphqlController {
  private readonly logger = new Logger(DynamicGraphqlController.name);

  constructor(private readonly dynamicGraphqlService: DynamicGraphqlService) {}

  @Post(':tableName/graphql')
  async handleGraphqlRequest(
    @Param('tableName') tableName: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const schema = await this.dynamicGraphqlService.generateSchema(tableName);
      const server = new ApolloServer({ schema });

      await server.start();
      const middleware = server.getMiddleware({
        path: `/api/v1/dataset/${tableName}/graphql`,
      });
      return middleware(req, res, next);
    } catch (error) {
      this.logger.error(
        `Error generating GraphQL schema for table ${tableName}: ${error.message}`,
      );
      res.status(500).send('Internal Server Error');
    }
  }
}
