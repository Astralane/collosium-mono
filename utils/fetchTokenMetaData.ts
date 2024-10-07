import axios from "axios";
import Moralis from "moralis";
import { headers } from "next/headers";

async function getTokenMetadata(pubKey: string) {
  try {
    const res = await axios.get(
      `https://solana-gateway.moralis.io/token/mainnet/${pubKey}/metadata`,
      {
        headers: {
          accept: "application/json",
          "X-API-Key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjA4Nzc0NDA5LThmMzEtNDU0MC1hOTUwLThiM2YyMGM0MDNlZSIsIm9yZ0lkIjoiMzc1MjMwIiwidXNlcklkIjoiMzg1NjAzIiwidHlwZUlkIjoiZmYwMDE5YjQtNjI3OC00ZmUzLWJhNTItYjY4MGU5NjA1ZWZhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDY3Njg0NTYsImV4cCI6NDg2MjUyODQ1Nn0.OO-a-7w64Hqe5hQ_-Jra0UYevMDIT3Z0sW5gD76Vjg4",
        },
      }
    );
    const data = await res.data;
    return data;
  } catch (e) {
    console.error(e);
  }
}

export default getTokenMetadata;

export async function fetchTokenMetaDataHelius(pubKeys: string[]) {
  const res = await axios.post(
    `https://api.helius.xyz/v0/token-metadata?api-key=deda5565-feca-474e-8e37-560a83c0b6b0`,
    {
      mintAccounts: pubKeys,
      includeOffChain: true,
    }
  );
  const data = res.data;
  return data;
}

type TokenPriceResponse = {
  pubKey: string;
  data: {
    value: string;
  }; // Adjust 'any' to match the structure of the fetched data if you know it
};

export async function fetchTokenPricesBirdsEye(
  pubKey: string,
  unixTime: number
): Promise<number> {
  const res = await axios.get(
    `https://public-api.birdeye.so/defi/historical_price_unix?address=${pubKey}&unixtime=${unixTime}`,
    {
      headers: {
        "X-API-KEY": "982828a2846146b888f507653bd4718d",
      },
    }
  );
  const data = await res.data;
  return data?.data?.value ?? 0;
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(42); // Return any number, here 42 is just an example
  //   }, 1000); // Simulate an asynchronous delay of 1 second
  // });
}

export type TTokenMetaDataBirdsEye = {
  address: string;
  symbol: string;
  logoURI: string;
  decimals: number;
};
export async function fetchTokenMetaData(pubKey: string) {
  const res = await axios.get(
    `https://public-api.birdeye.so/defi/token_overview?address=${pubKey}`,
    {
      headers: {
        "X-API-KEY": "982828a2846146b888f507653bd4718d",
      },
    }
  );
  const data = await res.data;
  return (data.data as TTokenMetaDataBirdsEye) ?? {};
}
