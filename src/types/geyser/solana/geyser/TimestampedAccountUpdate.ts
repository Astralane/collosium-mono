// Original file: src/geyser/geyser.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { AccountUpdate as _solana_geyser_AccountUpdate, AccountUpdate__Output as _solana_geyser_AccountUpdate__Output } from './AccountUpdate';

export interface TimestampedAccountUpdate {
  'ts'?: (_google_protobuf_Timestamp | null);
  'accountUpdate'?: (_solana_geyser_AccountUpdate | null);
}

export interface TimestampedAccountUpdate__Output {
  'ts': (_google_protobuf_Timestamp__Output | null);
  'accountUpdate': (_solana_geyser_AccountUpdate__Output | null);
}
