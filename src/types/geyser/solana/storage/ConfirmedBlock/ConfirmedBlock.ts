// Original file: src/geyser/confirmed_block.proto

import type { ConfirmedTransaction as _solana_storage_ConfirmedBlock_ConfirmedTransaction, ConfirmedTransaction__Output as _solana_storage_ConfirmedBlock_ConfirmedTransaction__Output } from './ConfirmedTransaction';
import type { Reward as _solana_storage_ConfirmedBlock_Reward, Reward__Output as _solana_storage_ConfirmedBlock_Reward__Output } from './Reward';
import type { UnixTimestamp as _solana_storage_ConfirmedBlock_UnixTimestamp, UnixTimestamp__Output as _solana_storage_ConfirmedBlock_UnixTimestamp__Output } from './UnixTimestamp';
import type { BlockHeight as _solana_storage_ConfirmedBlock_BlockHeight, BlockHeight__Output as _solana_storage_ConfirmedBlock_BlockHeight__Output } from './BlockHeight';
import type { Long } from '@grpc/proto-loader';

export interface ConfirmedBlock {
  'previousBlockhash'?: (string);
  'blockhash'?: (string);
  'parentSlot'?: (number | string | Long);
  'transactions'?: (_solana_storage_ConfirmedBlock_ConfirmedTransaction)[];
  'rewards'?: (_solana_storage_ConfirmedBlock_Reward)[];
  'blockTime'?: (_solana_storage_ConfirmedBlock_UnixTimestamp | null);
  'blockHeight'?: (_solana_storage_ConfirmedBlock_BlockHeight | null);
}

export interface ConfirmedBlock__Output {
  'previousBlockhash': (string);
  'blockhash': (string);
  'parentSlot': (string);
  'transactions': (_solana_storage_ConfirmedBlock_ConfirmedTransaction__Output)[];
  'rewards': (_solana_storage_ConfirmedBlock_Reward__Output)[];
  'blockTime': (_solana_storage_ConfirmedBlock_UnixTimestamp__Output | null);
  'blockHeight': (_solana_storage_ConfirmedBlock_BlockHeight__Output | null);
}
