import { createClient } from "@clickhouse/client";

export function getClickHouseClient() {
  try {
    const client = createClient({
      url: process.env.CLICK_HOUSE_URL || 'http://localhost:8123',
      password: process.env.CLICK_HOUSE_PASSWORD || '',
      username: process.env.CLICK_HOUSE_USERNAME || 'default',
      max_open_connections: 10,
      clickhouse_settings: {
        async_insert: 1,
        wait_for_async_insert: 1,
        async_insert_max_data_size: '1000000',
        async_insert_busy_timeout_ms: 1000,
      }
    })
    return client;
  } catch (e) {
    console.error('Error during creating click house client');
    throw new Error(e instanceof Error ? e.message : 'Unknown error');
  }
}
