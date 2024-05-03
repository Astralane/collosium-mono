// Original file: src/geyser/transaction_by_addr.proto

import type { TransactionError as _solana_storage_TransactionByAddr_TransactionError, TransactionError__Output as _solana_storage_TransactionByAddr_TransactionError__Output } from './TransactionError';
import type { Memo as _solana_storage_TransactionByAddr_Memo, Memo__Output as _solana_storage_TransactionByAddr_Memo__Output } from './Memo';
import type { UnixTimestamp as _solana_storage_TransactionByAddr_UnixTimestamp, UnixTimestamp__Output as _solana_storage_TransactionByAddr_UnixTimestamp__Output } from './UnixTimestamp';

export interface TransactionByAddrInfo {
  'signature'?: (Buffer | Uint8Array | string);
  'err'?: (_solana_storage_TransactionByAddr_TransactionError | null);
  'index'?: (number);
  'memo'?: (_solana_storage_TransactionByAddr_Memo | null);
  'blockTime'?: (_solana_storage_TransactionByAddr_UnixTimestamp | null);
}

export interface TransactionByAddrInfo__Output {
  'signature': (Buffer);
  'err': (_solana_storage_TransactionByAddr_TransactionError__Output | null);
  'index': (number);
  'memo': (_solana_storage_TransactionByAddr_Memo__Output | null);
  'blockTime': (_solana_storage_TransactionByAddr_UnixTimestamp__Output | null);
}
