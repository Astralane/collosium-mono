// Original file: src/geyser/transaction_by_addr.proto

import type { TransactionErrorType as _solana_storage_TransactionByAddr_TransactionErrorType, TransactionErrorType__Output as _solana_storage_TransactionByAddr_TransactionErrorType__Output } from './TransactionErrorType';
import type { InstructionError as _solana_storage_TransactionByAddr_InstructionError, InstructionError__Output as _solana_storage_TransactionByAddr_InstructionError__Output } from './InstructionError';
import type { TransactionDetails as _solana_storage_TransactionByAddr_TransactionDetails, TransactionDetails__Output as _solana_storage_TransactionByAddr_TransactionDetails__Output } from './TransactionDetails';

export interface TransactionError {
  'transactionError'?: (_solana_storage_TransactionByAddr_TransactionErrorType);
  'instructionError'?: (_solana_storage_TransactionByAddr_InstructionError | null);
  'transactionDetails'?: (_solana_storage_TransactionByAddr_TransactionDetails | null);
}

export interface TransactionError__Output {
  'transactionError': (_solana_storage_TransactionByAddr_TransactionErrorType__Output);
  'instructionError': (_solana_storage_TransactionByAddr_InstructionError__Output | null);
  'transactionDetails': (_solana_storage_TransactionByAddr_TransactionDetails__Output | null);
}
