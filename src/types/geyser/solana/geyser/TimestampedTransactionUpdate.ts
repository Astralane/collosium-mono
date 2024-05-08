// Original file: src/geyser/geyser.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../protobuf/Timestamp';
import type { TransactionUpdate as _solana_geyser_TransactionUpdate, TransactionUpdate__Output as _solana_geyser_TransactionUpdate__Output } from './TransactionUpdate';

export interface TimestampedTransactionUpdate {
  'ts'?: (_google_protobuf_Timestamp | null);
  'transaction'?: (_solana_geyser_TransactionUpdate | null);
}

export interface TimestampedTransactionUpdate__Output {
  'ts': (_google_protobuf_Timestamp__Output | null);
  'transaction': (_solana_geyser_TransactionUpdate__Output | null);
}
