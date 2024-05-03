// Original file: src/geyser/geyser.proto

import type { SlotUpdateStatus as _solana_geyser_SlotUpdateStatus, SlotUpdateStatus__Output as _solana_geyser_SlotUpdateStatus__Output } from './SlotUpdateStatus';
import type { Long } from '@grpc/proto-loader';

export interface SlotUpdate {
  'slot'?: (number | string | Long);
  'parentSlot'?: (number | string | Long);
  'status'?: (_solana_geyser_SlotUpdateStatus);
  '_parentSlot'?: "parentSlot";
}

export interface SlotUpdate__Output {
  'slot': (string);
  'parentSlot'?: (string);
  'status': (_solana_geyser_SlotUpdateStatus__Output);
  '_parentSlot': "parentSlot";
}
