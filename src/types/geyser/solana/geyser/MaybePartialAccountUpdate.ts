// Original file: src/geyser/geyser.proto

import type { PartialAccountUpdate as _solana_geyser_PartialAccountUpdate, PartialAccountUpdate__Output as _solana_geyser_PartialAccountUpdate__Output } from './PartialAccountUpdate';
import type { Heartbeat as _solana_geyser_Heartbeat, Heartbeat__Output as _solana_geyser_Heartbeat__Output } from './Heartbeat';

export interface MaybePartialAccountUpdate {
  'partialAccountUpdate'?: (_solana_geyser_PartialAccountUpdate | null);
  'hb'?: (_solana_geyser_Heartbeat | null);
  'msg'?: "partialAccountUpdate"|"hb";
}

export interface MaybePartialAccountUpdate__Output {
  'partialAccountUpdate'?: (_solana_geyser_PartialAccountUpdate__Output | null);
  'hb'?: (_solana_geyser_Heartbeat__Output | null);
  'msg': "partialAccountUpdate"|"hb";
}
