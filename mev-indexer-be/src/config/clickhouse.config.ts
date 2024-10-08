import { ConfigService, registerAs } from '@nestjs/config';
import { createClient } from '@clickhouse/client';

export default registerAs('clickhouse', () => ({
  url: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || 'default',
}));

export const clickhouseProvider = {
  provide: 'CLICKHOUSE_CLIENT',
  useFactory: (configService) => {
    const config = configService.get('clickhouse');
    return createClient({
      url: config.url,
      username: config.username,
      password: config.password,
      database: config.database,
    });
  },
  inject: [ConfigService],
};
