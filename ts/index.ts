import { configDotenv } from 'dotenv';
import { getClickHouseClient } from './src/click_house.client';
import { BirdeyeApiResponse, fetchPriceHistory } from './src/birdeye.client';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

configDotenv();
const DB_CLIENT = getClickHouseClient();

async function createTable(token: string) {
  const tableName = `${token}_price_history`;
  await DB_CLIENT.command({
    query: `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        slot UInt32,
        price Float64,
      ) 
      ENGINE ReplacingMergeTree
      ORDER BY slot
      PRIMARY KEY (slot)
    `
  })
}

async function saveData(token: string, data: BirdeyeApiResponse[]) {
  const tableName = `${token}_price_history`;
  for (const item of data) {
    let row = await DB_CLIENT.query({
      query: `SELECT max(slot) slot FROM slot_timestamp WHERE timestamp <= ${item.unixTime}`,
      format: 'JSONCompactEachRow',
    });
    let slot = String((await row.json())[0]);
    item.slot = +slot
  }
  const values = data.map(item => `(${item.slot}, ${item.value})`).join(',');


  await DB_CLIENT.command({
    query: `
      INSERT INTO ${tableName} (slot, price) VALUES ${values}
    `,
  })
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('token', {
      type: 'string',
      demandOption: true,
      description: 'Token address',
    })
    .option('timeFrom', {
      type: 'number',
      demandOption: true,
      description: 'Start time in UNIX timestamp',
    })
    .option('timeTo', {
      type: 'number',
      demandOption: true,
      description: 'End time in UNIX timestamp',
    }).argv;

  const token = argv.token;
  const timeFrom = argv.timeFrom;
  const timeTo = argv.timeTo;

  const interval = 12 * 60 * 60;

  await createTable(token);

  let start = timeFrom;
  while (start < timeTo) {
    const end = Math.min(start + interval, timeTo);
    try {
      const data = await fetchPriceHistory(token, start, end);
      await saveData(token, data);
      console.log(`Data from ${start} to ${end} saved.`);
    } catch (error) {
      console.error(`Error fetching data from ${start} to ${end}:`, error);
    }
    start = end;
  }
}

main().catch(console.error);
