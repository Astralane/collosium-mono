import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request;
    
    // Check if the context is for a GraphQL request
    if (context.getType<'graphql'>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      request = ctx.req;
    } else {
      request = context.switchToHttp().getRequest();
    }

    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const isValid = await this.authService.isValidApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}

