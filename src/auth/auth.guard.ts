import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KeysService } from 'src/keys/keys.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly keysService: KeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const searchResult = await this.keysService.getOne(apiKey);
    if (!searchResult) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
