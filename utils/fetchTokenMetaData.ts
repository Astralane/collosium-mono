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
