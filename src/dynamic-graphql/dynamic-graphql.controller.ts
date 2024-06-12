import {
  Controller,
  Post,
  Param,
  Req,
  Res,
  Next,
  Logger,
  Body,
} from '@nestjs/common';
import { DynamicGraphqlService } from './dynamic-graphql.service';
import { ApolloServer } from 'apollo-server-express';
import { Request, Response, NextFunction } from 'express';

@Controller('api/v1/dataset')
export class DynamicGraphqlController {
  private readonly logger = new Logger(DynamicGraphqlController.name);

  constructor(private readonly dynamicGraphqlService: DynamicGraphqlService) {}

  @Post(':id/graphql')
  async handleGraphqlRequest(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const { query } = body;

      const limitMatch = query.match(/limit:\s*(\d+)/);
      const pageMatch = query.match(/page:\s*(\d+)/);

      let limit =
        limitMatch && limitMatch[1] ? parseInt(limitMatch[1], 10) : 10;
      const page = pageMatch && pageMatch[1] ? parseInt(pageMatch[1], 10) : 1;

      if (limit > 50) {
        limit = 50;
      }

      const offset = (page - 1) * limit;

      const schema = await this.dynamicGraphqlService.generateSchema(
        id,
        offset,
        limit,
      );
      const server = new ApolloServer({ schema });

      await server.start();
      const middleware = server.getMiddleware({
        path: `/api/v1/dataset/${id}/graphql`,
      });
      return middleware(req, res, next);
    } catch (error) {
      this.logger.error(
        `Error generating GraphQL schema for table ${id}: ${error.message}`,
      );
      res.status(500).send('Internal Server Error');
    }
  }
}
