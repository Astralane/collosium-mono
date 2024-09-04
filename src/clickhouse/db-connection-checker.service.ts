import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClickHouseClient } from '@clickhouse/client';

@Injectable()
export class DatabaseConnectionCheckerService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseConnectionCheckerService.name);

  private readonly maxRetries = 5;
  private readonly retryDelay = 2000;

  constructor(
    @Inject('CLICKHOUSE_CLIENT')
    private readonly clickhouseClient: ClickHouseClient,
  ) {}

  async onModuleInit() {
    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        attempt++;
        const result = await this.clickhouseClient.ping();

        if (result.success) {
          this.logger.log('Successfully connected to the ClickHouse database');
          return;
        } else {
          throw new Error('Ping to ClickHouse failed');
        }
      } catch (error) {
        this.logger.error(
          `Attempt ${attempt} to connect to the ClickHouse database failed: ${error.message}`,
        );

        if (attempt < this.maxRetries) {
          this.logger.log(`Retrying in ${this.retryDelay / 1000} seconds...`);
          await this.delay(this.retryDelay);
        } else {
          this.logger.error(
            'Could not connect to the ClickHouse database after maximum retries. Application startup aborted.',
          );
          throw new Error(
            'Could not connect to the ClickHouse database. Application startup aborted.',
          );
        }
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
