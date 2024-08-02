import axios from "axios";

const URL = 'https://public-api.birdeye.so/defi/history_price';
const API_KEY = '14335da880764a9bacb71ad7c24895f6';

export interface BirdeyeApiResponse {
  unixTime: number,
  value: number,
  slot: number,
}

export async function fetchPriceHistory(token: string, timeFrom: number, timeTo: number): Promise<BirdeyeApiResponse[]> {
  try {
    const response = await axios.get(URL, {
      params: {
        address: token,
        address_type: 'token',
        type: '1m',
        time_from: timeFrom,
        time_to: timeTo,
      },
      headers: {
        'X-API-KEY': API_KEY,
      }
    });
    return response.data['data']['items'];
  } catch (e) {
    console.error('Error during fetching data from birdeye', e);
    throw new Error(e instanceof Error ? e.message : 'Unknown error');
  }
}
