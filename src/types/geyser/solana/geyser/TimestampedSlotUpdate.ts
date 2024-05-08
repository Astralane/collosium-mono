// Original file: src/geyser/geyser.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../protobuf/Timestamp';
import type { SlotUpdate as _solana_geyser_SlotUpdate, SlotUpdate__Output as _solana_geyser_SlotUpdate__Output } from './SlotUpdate';

export interface TimestampedSlotUpdate {
  'ts'?: (_google_protobuf_Timestamp | null);
  'slotUpdate'?: (_solana_geyser_SlotUpdate | null);
}

export interface TimestampedSlotUpdate__Output {
  'ts': (_google_protobuf_Timestamp__Output | null);
  'slotUpdate': (_solana_geyser_SlotUpdate__Output | null);
}
