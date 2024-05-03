// Original file: src/geyser/transaction_by_addr.proto

import type { InstructionErrorType as _solana_storage_TransactionByAddr_InstructionErrorType, InstructionErrorType__Output as _solana_storage_TransactionByAddr_InstructionErrorType__Output } from './InstructionErrorType';
import type { CustomError as _solana_storage_TransactionByAddr_CustomError, CustomError__Output as _solana_storage_TransactionByAddr_CustomError__Output } from './CustomError';

export interface InstructionError {
  'index'?: (number);
  'error'?: (_solana_storage_TransactionByAddr_InstructionErrorType);
  'custom'?: (_solana_storage_TransactionByAddr_CustomError | null);
}

export interface InstructionError__Output {
  'index': (number);
  'error': (_solana_storage_TransactionByAddr_InstructionErrorType__Output);
  'custom': (_solana_storage_TransactionByAddr_CustomError__Output | null);
}
