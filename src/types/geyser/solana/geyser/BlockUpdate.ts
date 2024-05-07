// Original file: src/geyser/geyser.proto

import type { Reward as _solana_storage_ConfirmedBlock_Reward, Reward__Output as _solana_storage_ConfirmedBlock_Reward__Output } from '../storage/ConfirmedBlock/Reward';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface BlockUpdate {
  'slot'?: (number | string | Long);
  'blockhash'?: (string);
  'rewards'?: (_solana_storage_ConfirmedBlock_Reward)[];
  'blockTime'?: (_google_protobuf_Timestamp | null);
  'blockHeight'?: (number | string | Long);
  'executedTransactionCount'?: (number | string | Long);
  'entryCount'?: (number | string | Long);
  '_blockHeight'?: "blockHeight";
  '_executedTransactionCount'?: "executedTransactionCount";
  '_entryCount'?: "entryCount";
}

export interface BlockUpdate__Output {
  'slot': (string);
  'blockhash': (string);
  'rewards': (_solana_storage_ConfirmedBlock_Reward__Output)[];
  'blockTime': (_google_protobuf_Timestamp__Output | null);
  'blockHeight'?: (string);
  'executedTransactionCount'?: (string);
  'entryCount'?: (string);
  '_blockHeight': "blockHeight";
  '_executedTransactionCount': "executedTransactionCount";
  '_entryCount': "entryCount";
}
