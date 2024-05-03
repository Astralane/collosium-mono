// Original file: src/geyser/geyser.proto

import type { ConfirmedTransaction as _solana_storage_ConfirmedBlock_ConfirmedTransaction, ConfirmedTransaction__Output as _solana_storage_ConfirmedBlock_ConfirmedTransaction__Output } from '../storage/ConfirmedBlock/ConfirmedTransaction';
import type { Long } from '@grpc/proto-loader';

export interface TransactionUpdate {
  'slot'?: (number | string | Long);
  'signature'?: (string);
  'isVote'?: (boolean);
  'txIdx'?: (number | string | Long);
  'tx'?: (_solana_storage_ConfirmedBlock_ConfirmedTransaction | null);
}

export interface TransactionUpdate__Output {
  'slot': (string);
  'signature': (string);
  'isVote': (boolean);
  'txIdx': (string);
  'tx': (_solana_storage_ConfirmedBlock_ConfirmedTransaction__Output | null);
}
