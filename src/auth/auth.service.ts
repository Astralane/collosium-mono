import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async isValidApiKey(apiKey: string): Promise<boolean> {
    const url = `http://localhost:3001/keys/${apiKey}`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
