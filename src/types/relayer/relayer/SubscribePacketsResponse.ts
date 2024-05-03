// Original file: src/relayer/relayer.proto

import type { Header as _shared_Header, Header__Output as _shared_Header__Output } from '../shared/Header';
import type { Heartbeat as _shared_Heartbeat, Heartbeat__Output as _shared_Heartbeat__Output } from '../shared/Heartbeat';
import type { PacketBatch as _packet_PacketBatch, PacketBatch__Output as _packet_PacketBatch__Output } from '../packet/PacketBatch';

export interface SubscribePacketsResponse {
  'header'?: (_shared_Header | null);
  'heartbeat'?: (_shared_Heartbeat | null);
  'batch'?: (_packet_PacketBatch | null);
  'msg'?: "heartbeat"|"batch";
}

export interface SubscribePacketsResponse__Output {
  'header': (_shared_Header__Output | null);
  'heartbeat'?: (_shared_Heartbeat__Output | null);
  'batch'?: (_packet_PacketBatch__Output | null);
  'msg': "heartbeat"|"batch";
}
