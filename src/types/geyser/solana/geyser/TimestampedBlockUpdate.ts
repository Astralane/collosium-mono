// Original file: src/geyser/geyser.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { BlockUpdate as _solana_geyser_BlockUpdate, BlockUpdate__Output as _solana_geyser_BlockUpdate__Output } from './BlockUpdate';

export interface TimestampedBlockUpdate {
  'ts'?: (_google_protobuf_Timestamp | null);
  'blockUpdate'?: (_solana_geyser_BlockUpdate | null);
}

export interface TimestampedBlockUpdate__Output {
  'ts': (_google_protobuf_Timestamp__Output | null);
  'blockUpdate': (_solana_geyser_BlockUpdate__Output | null);
}
