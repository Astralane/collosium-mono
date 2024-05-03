// Original file: src/geyser/confirmed_block.proto

import type { Transaction as _solana_storage_ConfirmedBlock_Transaction, Transaction__Output as _solana_storage_ConfirmedBlock_Transaction__Output } from './Transaction';
import type { TransactionStatusMeta as _solana_storage_ConfirmedBlock_TransactionStatusMeta, TransactionStatusMeta__Output as _solana_storage_ConfirmedBlock_TransactionStatusMeta__Output } from './TransactionStatusMeta';

export interface ConfirmedTransaction {
  'transaction'?: (_solana_storage_ConfirmedBlock_Transaction | null);
  'meta'?: (_solana_storage_ConfirmedBlock_TransactionStatusMeta | null);
}

export interface ConfirmedTransaction__Output {
  'transaction': (_solana_storage_ConfirmedBlock_Transaction__Output | null);
  'meta': (_solana_storage_ConfirmedBlock_TransactionStatusMeta__Output | null);
}
