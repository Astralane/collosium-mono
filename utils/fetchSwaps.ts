import { useEffect, useState } from "react";
import {
  Connection,
  ParsedTransactionWithMeta,
  PublicKey,
} from "@solana/web3.js";

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

export const useTransactionDetails = (signature: string) => {
  const [transactionDetails, setTransactionDetails] =
    useState<ParsedTransactionWithMeta | null>(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");
        const transaction = await connection.getParsedTransaction(signature);
        setTransactionDetails(transaction);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    if (signature) {
      fetchTransactionDetails();
    }
  }, [signature]);

  return transactionDetails;
};
