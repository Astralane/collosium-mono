import { act, use, useEffect, useState } from "react";
import {
  Connection,
  ParsedTransactionWithMeta,
  PublicKey,
} from "@solana/web3.js";
import axios from "axios";
import {
  Action,
  ActionInfo,
  MergedTx,
  ParsedData,
  ParsedResponse,
  ParsedTx,
  Result,
  TMevResult,
} from "@/types/parsedType";

const SOLANA_RPC_URL =
  "https://tame-damp-vineyard.solana-mainnet.quiknode.pro/0193c820ed165e778de216c94d3655b3af7278b6";
const RAYDIUM_PROGRAM_ID = new PublicKey(
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
);

export const useRaydiumSwapListener = (onSwapDetected: (logs: any) => void) => {
  useEffect(() => {
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");

    const listenToRaydiumSwaps = () => {
      connection.onLogs(RAYDIUM_PROGRAM_ID, async (log) => {
        const { signature, err, logs } = log;
        onSwapDetected({ signature, logs });
      });
    };

    listenToRaydiumSwaps();
  }, [onSwapDetected]);
};

// export const useTransactionDetails = (signature: string) => {
//   const [transactionDetails, setTransactionDetails] =
//     useState<ParsedTransactionWithMeta | null>(null);

//   useEffect(() => {
//     const fetchTransactionDetails = async () => {
//       try {
//         const connection = new Connection(SOLANA_RPC_URL, "confirmed");
//         const transaction = await connection.getParsedTransaction(signature);
//         setTransactionDetails(transaction);
//       } catch (error) {
//         console.error("Error fetching transaction details:", error);
//       }
//     };

//     if (signature) {
//       fetchTransactionDetails();
//     }
//   }, [signature]);

//   return transactionDetails;
// };

export async function getTransactionDetails(signature: string) {
  try {
    if (!signature) {
      throw new Error("Signature is required");
    }

    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const transaction = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
    //console.log(transaction, parseMultipleTx());
    return transaction; // Return the transaction details
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
}

export async function parseMultipleTx(signatures: string[]) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "klsfTLhZwA-OGpOH",
      },
    };

    const data = {
      network: "mainnet-beta",
      transaction_signatures: signatures,
      enable_raw: false,
      enable_events: true,
    };

    const response = await axios.post(
      "https://api.shyft.to/sol/v1/transaction/parse_selected",
      data,
      config
    );

    return response.data; // Return the parsed data
  } catch (error) {
    console.error("Error:", error);
  }
}

export const useFetchSlots = () => {
  const [initialSlot, setInitialSlot] = useState<number | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [finalData, setFinalData] = useState<MergedTx[]>(getMockData());

  // Fetch the latest slot on mount
  useEffect(() => {
    const fetchInitialSlot = async () => {
      try {
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");
        const latestSlot = await connection.getSlot();
        setSlot(latestSlot); // Set the initial slot
        setInitialSlot(latestSlot);
      } catch (error) {
        console.error("Error fetching initial slot:", error);
      }
    };

    fetchInitialSlot();
  }, []);

  // Fetch data whenever the slot changes
  useEffect(() => {
    const fetchData = async () => {
      if (slot !== null) {
        try {
          const response = await axios.get(
            `http://198.244.253.172:3000/sandwiches/${slot}`
          );
          const result = response.data;
          const formattedData = await formatData(result);
          setFinalData((prevData) => [...prevData, ...formattedData]);
        } catch (error) {
          console.error("Error fetching data for slot:", error);
        }
      }
    };

    fetchData();
  }, [slot]);

  // Increment slot every 1 second and stop after 10 slots
  useEffect(() => {
    if (initialSlot !== null && slot !== null && initialSlot - slot < 10) {
      const intervalId = setInterval(() => {
        setSlot((prevSlot) => (prevSlot !== null ? prevSlot - 1 : null));
      }, 2000);

      return () => clearInterval(intervalId); // Clear interval on unmount or when conditions change
    }
  }, [slot, initialSlot]);

  return finalData;
};

export const fetchSlots = async () => {
  const connection = new Connection(SOLANA_RPC_URL, "confirmed");
  const slot = await connection.getSlot();
  return slot;
};
export const formatData = async (result: TMevResult[]) => {
  const frontRunsigs = result.map((res) => res.front_run);
  const backRunsigs = result.map((res) => res.backrun);
  const signatures = [...frontRunsigs, ...backRunsigs];
  const parsedData = await parseMultipleTx(signatures);
  const parsedRes: ParsedResponse = {};
  parsedData?.result?.map((res: Result) => {
    res?.actions?.map((action: Action) => {
      if (action.type === "SWAP") {
        const key = res.signatures?.[0] as string;
        parsedRes[key] = action?.info;
      }
    });
  });
  const parsedResult: MergedTx[] = result.map((res) => {
    return {
      ...res,
      frontRunData: {
        signature: res.front_run,
        data: parsedRes[res.front_run] as ActionInfo,
      },
      backRunData: {
        signature: res.backrun,
        data: parsedRes[res.backrun] as ActionInfo,
      },
    };
  });
  return parsedResult;
};
export const getMockData = () => {
  const frontRunsigs = result.map((res) => res.front_run);
  const backRunsigs = result.map((res) => res.backrun);
  const signatures = [...frontRunsigs, ...backRunsigs];
  // const parsedData = await parseMultipleTx(signatures);
  // const parsedRes: ParsedResponse = {};
  // parsedData?.result?.map((res: Result) => {
  //   res?.actions?.map((action: Action) => {
  //     if (action.type === "SWAP") {
  //       const key = res.signatures?.[0] as string;
  //       parsedRes[key] = action?.info;
  //     }
  //   });
  // });
  const resultData: MergedTx[] = result.map((res) => {
    return {
      ...res,
      frontRunData: {
        signature: res.front_run,
        data: resultDummy[res.front_run] as ActionInfo,
      },
      backRunData: {
        signature: res.backrun,
        data: resultDummy[res.backrun] as ActionInfo,
      },
    };
  });
  return resultData;
};

const result: TMevResult[] = [
  {
    attacker: "ARSCioaDhR6oW7vcfEDF24XFQpedH5h6p33VxLGbkfVa",
    front_run:
      "5DutKgtRWTDNMFHcbSfPm15eJPDNfvN1shYVzzJ5mFHkXWSSuZzchvMyycYDCZ7qvg3pH8VYK2guMWnSZVHXdmLC",
    backrun:
      "5W3sMcndgyr5cZQUFMJBL6p2gsTMi43o4newxXakmq71PXyHhJddf25EANb8BBNedFUVXBDTGvEVEsGb24f7Aw8L",
    victims: [
      "436jY4YFtC2HjrtJKZGtXRCUYpJdKjmxGe5Qn2qWjNy2tjcbtzbUhXYJxuhw7dqNXuaTc6NBEX7PEjX7zCTHXt8Q",
    ],
  },
  {
    attacker: "HYPPBcYaqx2e4Nqy6B1WJN1DZavuYQVJnKLvjHSw2UoE",
    front_run:
      "yWBXv2sE8raBXAwzA47YUZwRDY875FzZAjbLDPAmaYefCtDY79d26pFivt1ymEE2EmEzJFGerS1vRinYSmbyA8N",
    backrun:
      "4LFukE2KUbat5oT6zYt2pdr5ueGJWGBRza7RpeqWBLX29c68EtekffUYtabwzQFh86w5Ejg5EWi2yRN98vGDeXd6",
    victims: [
      "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",
    ],
  },
  {
    attacker: "5qv9KoExBCYg8siqEAj4pFfsaY7KtgyMxMFgw4MA6LPk",
    front_run:
      "3r2kKw1zNMLTaxw1C93gE6xZHKxL9gEtiKkxsCRkp9zW49wQ7Lg33mtkBR5yET38FcbaCiBHsXwCLiBdtkrF68j7",
    backrun:
      "5DpW2g3zXszDCikLHkTeH28PPTp6XvHh64j8hPhVh3vJR8TkBjFrqxKvMKupNhQAh7c2LfMcfSkyXzgKTgGgWjqc",
    victims: [
      "3E7MVb5XXqrM4EUynuvhFgjhzHZvQqFrX25GZYg3gEJmpLSXJjWdiQEg8ZqmkUmQtsi342sRoGyMP15TKwjQvs7f",
    ],
  },
  {
    attacker: "ARSCio5CJmQV1V7bxF3k12crr9HRKcoesSQX15EDtNv5",
    front_run:
      "3HPNbmQnxqki8fNRpWbdeLt59nkNvvVWv6PompyRbdZvk88JSt7hur3cM8NjYfPRtbeK3Gdz48qrS9j4i6GNctuo",
    backrun:
      "32WyKBD3sLgu6FBUXXw4mKwUeXvHCKpdUbkDwUCLB2sRkye6Hi3yhKZajHgRGjFba3sbzW9Y2ogVwUE8jBwemYUY",
    victims: [
      "5cjJXfdy9yeG3sK5Ga5zE5uwR95VBjkNhUshCMLfJsAgc5kQzbG8h2pvZku6aoUoHYDsMrx7rM52Rm7yvLqE4pyy",
    ],
  },
];

const resultDummy: ParsedTx = {
  "5DutKgtRWTDNMFHcbSfPm15eJPDNfvN1shYVzzJ5mFHkXWSSuZzchvMyycYDCZ7qvg3pH8VYK2guMWnSZVHXdmLC":
    {
      swapper: "5V97uEb4ZNuXFudphU5nwUapRmt7a2V51TbULQvPJwnx",
      tokens_swapped: {
        in: {
          token_address: "So11111111111111111111111111111111111111112",
          name: "Wrapped SOL",
          symbol: "SOL",
          image_uri:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          amount: 6.489568305,
          amount_raw: 6489568305,
        },
        out: {
          token_address: "CkP15sABWWhhy9YTcoxL5KNxJuzgtAbbDJ5wcwy2pump",
          name: "Oracle",
          symbol: "ORACLE",
          image_uri:
            "https://cf-ipfs.com/ipfs/QmcCvNu4tAurRMeBXytUL66gM5CoDDQVxbmT88Tz1knht2",
          amount: 5238137.858729,
          amount_raw: 5238137858729,
        },
      },
      swaps: [
        {
          liquidity_pool_address:
            "DndU8CTUtpscngLeA4WLgJZnA6ACRp89mNydP64r3kPh",
          name: "Wrapped SOL-Oracle",
          source: "raydiumAmm",
          in: {
            token_address: "So11111111111111111111111111111111111111112",
            name: "Wrapped SOL",
            symbol: "SOL",
            image_uri:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            amount: 6.489568305,
            amount_raw: 6489568305,
          },
          out: {
            token_address: "CkP15sABWWhhy9YTcoxL5KNxJuzgtAbbDJ5wcwy2pump",
            name: "Oracle",
            symbol: "ORACLE",
            image_uri:
              "https://cf-ipfs.com/ipfs/QmcCvNu4tAurRMeBXytUL66gM5CoDDQVxbmT88Tz1knht2",
            amount: 5238137.858729,
            amount_raw: 5238137858729,
          },
        },
      ],
      slippage_in_percent: null,
      quoted_out_amount: null,
      slippage_paid: null,
    },
  yWBXv2sE8raBXAwzA47YUZwRDY875FzZAjbLDPAmaYefCtDY79d26pFivt1ymEE2EmEzJFGerS1vRinYSmbyA8N:
    {
      swapper: "BoR7gDF48Nqh3nrAR2uwpf9cPB8krb6qEBmD5z4RkRv6",
      tokens_swapped: {
        in: {
          token_address: "DXCoKQ7iLpux398fNHewQn6djfGobzFuPiR5o8hrVHAb",
          name: "Fatality Coin",
          symbol: "FATALITY",
          image_uri:
            "https://coin-images.coingecko.com/coins/images/36415/large/Untitled_design_%283%29.png?1711420724",
          amount: 0.000028865,
          amount_raw: 28865,
        },
        out: {
          token_address: "So11111111111111111111111111111111111111112",
          name: "Wrapped SOL",
          symbol: "SOL",
          image_uri:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          amount: 3e-9,
          amount_raw: 3,
        },
      },
      swaps: [
        {
          liquidity_pool_address:
            "91aiMxmBShJhG4FztFWgSwkSCE2EiuVmnkvjqZec4rSf",
          name: "Fatality Coin-Wrapped SOL",
          source: "raydiumAmm",
          in: {
            token_address: "DXCoKQ7iLpux398fNHewQn6djfGobzFuPiR5o8hrVHAb",
            name: "Fatality Coin",
            symbol: "FATALITY",
            image_uri:
              "https://coin-images.coingecko.com/coins/images/36415/large/Untitled_design_%283%29.png?1711420724",
            amount: 0.000028865,
            amount_raw: 28865,
          },
          out: {
            token_address: "So11111111111111111111111111111111111111112",
            name: "Wrapped SOL",
            symbol: "SOL",
            image_uri:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            amount: 3e-9,
            amount_raw: 3,
          },
        },
      ],
      slippage_in_percent: null,
      quoted_out_amount: null,
      slippage_paid: null,
    },
  "3r2kKw1zNMLTaxw1C93gE6xZHKxL9gEtiKkxsCRkp9zW49wQ7Lg33mtkBR5yET38FcbaCiBHsXwCLiBdtkrF68j7":
    {
      swapper: "AD65fgYti96iSSzSPaNazV9Bs29m7JbNomGjG4Cp5WFS",
      tokens_swapped: {
        in: {
          token_address: "So11111111111111111111111111111111111111112",
          name: "Wrapped SOL",
          symbol: "SOL",
          image_uri:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          amount: 0.16712507,
          amount_raw: 167125070,
        },
        out: {
          token_address: "9WJfswkHdYdrdYBV8x97gK8txGL9DS4tWhPGfmTEpump",
          name: "nickelodeo",
          symbol: "deo",
          image_uri:
            "https://cf-ipfs.com/ipfs/QmQ64ra2TmwoExhA9obcnhJNP6PsjJEaqhmvBAFur9Y2Ez",
          amount: 391378.14661,
          amount_raw: 391378146610,
        },
      },
      swaps: [
        {
          liquidity_pool_address:
            "6eckfDKuJxWi69CJFV8ntjaEKSiGpbqLL8zovrix1rwy",
          name: "Wrapped SOL-nickelodeo",
          source: "raydiumAmm",
          in: {
            token_address: "So11111111111111111111111111111111111111112",
            name: "Wrapped SOL",
            symbol: "SOL",
            image_uri:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            amount: 0.16712507,
            amount_raw: 167125070,
          },
          out: {
            token_address: "9WJfswkHdYdrdYBV8x97gK8txGL9DS4tWhPGfmTEpump",
            name: "nickelodeo",
            symbol: "deo",
            image_uri:
              "https://cf-ipfs.com/ipfs/QmQ64ra2TmwoExhA9obcnhJNP6PsjJEaqhmvBAFur9Y2Ez",
            amount: 391378.14661,
            amount_raw: 391378146610,
          },
        },
      ],
      slippage_in_percent: null,
      quoted_out_amount: null,
      slippage_paid: null,
    },
  "3HPNbmQnxqki8fNRpWbdeLt59nkNvvVWv6PompyRbdZvk88JSt7hur3cM8NjYfPRtbeK3Gdz48qrS9j4i6GNctuo":
    {
      swapper: "5V97uEb4ZNuXFudphU5nwUapRmt7a2V51TbULQvPJwnx",
      tokens_swapped: {
        in: {
          token_address: "So11111111111111111111111111111111111111112",
          name: "Wrapped SOL",
          symbol: "SOL",
          image_uri:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          amount: 7.049099772,
          amount_raw: 7049099772,
        },
        out: {
          token_address: "94Nb4UowH4QWFfXaNL46kSVVGeJV5zy88bs8KCxnmwVN",
          name: "reddit cat",
          symbol: "r/Limmy",
          image_uri:
            "https://cf-ipfs.com/ipfs/QmUKwzuMvF2QMhFr3EoHmk16agLvLkFoyWUWgKgaSJskbZ",
          amount: 2110439.030157,
          amount_raw: 2110439030157,
        },
      },
      swaps: [
        {
          liquidity_pool_address:
            "FUtYPBnUJHGzQatpqRh8ursLA3qZxud56ZCaY9tbBuzD",
          name: "Wrapped SOL-reddit cat",
          source: "raydiumAmm",
          in: {
            token_address: "So11111111111111111111111111111111111111112",
            name: "Wrapped SOL",
            symbol: "SOL",
            image_uri:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            amount: 7.049099772,
            amount_raw: 7049099772,
          },
          out: {
            token_address: "94Nb4UowH4QWFfXaNL46kSVVGeJV5zy88bs8KCxnmwVN",
            name: "reddit cat",
            symbol: "r/Limmy",
            image_uri:
              "https://cf-ipfs.com/ipfs/QmUKwzuMvF2QMhFr3EoHmk16agLvLkFoyWUWgKgaSJskbZ",
            amount: 2110439.030157,
            amount_raw: 2110439030157,
          },
        },
      ],
      slippage_in_percent: null,
      quoted_out_amount: null,
      slippage_paid: null,
    },
  "5W3sMcndgyr5cZQUFMJBL6p2gsTMi43o4newxXakmq71PXyHhJddf25EANb8BBNedFUVXBDTGvEVEsGb24f7Aw8L":
    {
      swapper: "5V97uEb4ZNuXFudphU5nwUapRmt7a2V51TbULQvPJwnx",
      tokens_swapped: {
        in: {
          token_address: "CkP15sABWWhhy9YTcoxL5KNxJuzgtAbbDJ5wcwy2pump",
          name: "Oracle",
          symbol: "ORACLE",
          image_uri:
            "https://cf-ipfs.com/ipfs/QmcCvNu4tAurRMeBXytUL66gM5CoDDQVxbmT88Tz1knht2",
          amount: 5238137.858729,
          amount_raw: 5238137858729,
        },
        out: {
          token_address: "So11111111111111111111111111111111111111112",
          name: "Wrapped SOL",
          symbol: "SOL",
          image_uri:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          amount: 6.544057998,
          amount_raw: 6544057998,
        },
      },
      swaps: [
        {
          liquidity_pool_address:
            "DndU8CTUtpscngLeA4WLgJZnA6ACRp89mNydP64r3kPh",
          name: "Oracle-Wrapped SOL",
          source: "raydiumAmm",
          in: {
            token_address: "CkP15sABWWhhy9YTcoxL5KNxJuzgtAbbDJ5wcwy2pump",
            name: "Oracle",
            symbol: "ORACLE",
            image_uri:
              "https://cf-ipfs.com/ipfs/QmcCvNu4tAurRMeBXytUL66gM5CoDDQVxbmT88Tz1knht2",
            amount: 5238137.858729,
            amount_raw: 5238137858729,
          },
          out: {
            token_address: "So11111111111111111111111111111111111111112",
            name: "Wrapped SOL",
            symbol: "SOL",
            image_uri:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            amount: 6.544057998,
            amount_raw: 6544057998,
          },
        },
      ],
      slippage_in_percent: null,
      quoted_out_amount: null,
      slippage_paid: null,
    },
  "4LFukE2KUbat5oT6zYt2pdr5ueGJWGBRza7RpeqWBLX29c68EtekffUYtabwzQFh86w5Ejg5EWi2yRN98vGDeXd6":
    {
      swapper: "BoR7gDF48Nqh3nrAR2uwpf9cPB8krb6qEBmD5z4RkRv6",
      tokens_swapped: {
        in: {
          token_address: "So11111111111111111111111111111111111111112",
          name: "Wrapped SOL",
          symbol: "SOL",
          image_uri:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          amount: 0.000002,
          amount_raw: 2000,
        },
        out: {
          token_address: "DXCoKQ7iLpux398fNHewQn6djfGobzFuPiR5o8hrVHAb",
          name: "Fatality Coin",
          symbol: "FATALITY",
          image_uri:
            "https://coin-images.coingecko.com/coins/images/36415/large/Untitled_design_%283%29.png?1711420724",
          amount: 0.017325184,
          amount_raw: 17325184,
        },
      },
      swaps: [
        {
          liquidity_pool_address:
            "91aiMxmBShJhG4FztFWgSwkSCE2EiuVmnkvjqZec4rSf",
          name: "Wrapped SOL-Fatality Coin",
          source: "raydiumAmm",
          in: {
            token_address: "So11111111111111111111111111111111111111112",
            name: "Wrapped SOL",
            symbol: "SOL",
            image_uri:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            amount: 0.000002,
            amount_raw: 2000,
          },
          out: {
            token_address: "DXCoKQ7iLpux398fNHewQn6djfGobzFuPiR5o8hrVHAb",
            name: "Fatality Coin",
            symbol: "FATALITY",
            image_uri:
              "https://coin-images.coingecko.com/coins/images/36415/large/Untitled_design_%283%29.png?1711420724",
            amount: 0.017325184,
            amount_raw: 17325184,
          },
        },
      ],
      slippage_in_percent: null,
      quoted_out_amount: null,
      slippage_paid: null,
    },
  "5DpW2g3zXszDCikLHkTeH28PPTp6XvHh64j8hPhVh3vJR8TkBjFrqxKvMKupNhQAh7c2LfMcfSkyXzgKTgGgWjqc":
    {
      swapper: "AD65fgYti96iSSzSPaNazV9Bs29m7JbNomGjG4Cp5WFS",
      tokens_swapped: {
        in: {
          token_address: "9WJfswkHdYdrdYBV8x97gK8txGL9DS4tWhPGfmTEpump",
          name: "nickelodeo",
          symbol: "deo",
          image_uri:
            "https://cf-ipfs.com/ipfs/QmQ64ra2TmwoExhA9obcnhJNP6PsjJEaqhmvBAFur9Y2Ez",
          amount: 391378.14661,
          amount_raw: 391378146610,
        },
        out: {
          token_address: "So11111111111111111111111111111111111111112",
          name: "Wrapped SOL",
          symbol: "SOL",
          image_uri:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          amount: 0.168216804,
          amount_raw: 168216804,
        },
      },
      swaps: [
        {
          liquidity_pool_address:
            "6eckfDKuJxWi69CJFV8ntjaEKSiGpbqLL8zovrix1rwy",
          name: "nickelodeo-Wrapped SOL",
          source: "raydiumAmm",
          in: {
            token_address: "9WJfswkHdYdrdYBV8x97gK8txGL9DS4tWhPGfmTEpump",
            name: "nickelodeo",
            symbol: "deo",
            image_uri:
              "https://cf-ipfs.com/ipfs/QmQ64ra2TmwoExhA9obcnhJNP6PsjJEaqhmvBAFur9Y2Ez",
            amount: 391378.14661,
            amount_raw: 391378146610,
          },
          out: {
            token_address: "So11111111111111111111111111111111111111112",
            name: "Wrapped SOL",
            symbol: "SOL",
            image_uri:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            amount: 0.168216804,
            amount_raw: 168216804,
          },
        },
      ],
      slippage_in_percent: null,
      quoted_out_amount: null,
      slippage_paid: null,
    },
  "32WyKBD3sLgu6FBUXXw4mKwUeXvHCKpdUbkDwUCLB2sRkye6Hi3yhKZajHgRGjFba3sbzW9Y2ogVwUE8jBwemYUY":
    {
      swapper: "5V97uEb4ZNuXFudphU5nwUapRmt7a2V51TbULQvPJwnx",
      tokens_swapped: {
        in: {
          token_address: "94Nb4UowH4QWFfXaNL46kSVVGeJV5zy88bs8KCxnmwVN",
          name: "reddit cat",
          symbol: "r/Limmy",
          image_uri:
            "https://cf-ipfs.com/ipfs/QmUKwzuMvF2QMhFr3EoHmk16agLvLkFoyWUWgKgaSJskbZ",
          amount: 2110439.030157,
          amount_raw: 2110439030157,
        },
        out: {
          token_address: "So11111111111111111111111111111111111111112",
          name: "Wrapped SOL",
          symbol: "SOL",
          image_uri:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          amount: 7.16319757,
          amount_raw: 7163197570,
        },
      },
      swaps: [
        {
          liquidity_pool_address:
            "FUtYPBnUJHGzQatpqRh8ursLA3qZxud56ZCaY9tbBuzD",
          name: "reddit cat-Wrapped SOL",
          source: "raydiumAmm",
          in: {
            token_address: "94Nb4UowH4QWFfXaNL46kSVVGeJV5zy88bs8KCxnmwVN",
            name: "reddit cat",
            symbol: "r/Limmy",
            image_uri:
              "https://cf-ipfs.com/ipfs/QmUKwzuMvF2QMhFr3EoHmk16agLvLkFoyWUWgKgaSJskbZ",
            amount: 2110439.030157,
            amount_raw: 2110439030157,
          },
          out: {
            token_address: "So11111111111111111111111111111111111111112",
            name: "Wrapped SOL",
            symbol: "SOL",
            image_uri:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            amount: 7.16319757,
            amount_raw: 7163197570,
          },
        },
      ],
      slippage_in_percent: null,
      quoted_out_amount: null,
      slippage_paid: null,
    },
};
