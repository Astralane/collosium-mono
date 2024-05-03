// Original file: src/relayer/packet.proto

import type { PacketFlags as _packet_PacketFlags, PacketFlags__Output as _packet_PacketFlags__Output } from './PacketFlags';
import type { Long } from '@grpc/proto-loader';

export interface Meta {
  'size'?: (number | string | Long);
  'addr'?: (string);
  'port'?: (number);
  'flags'?: (_packet_PacketFlags | null);
  'senderStake'?: (number | string | Long);
}

export interface Meta__Output {
  'size': (string);
  'addr': (string);
  'port': (number);
  'flags': (_packet_PacketFlags__Output | null);
  'senderStake': (string);
}
