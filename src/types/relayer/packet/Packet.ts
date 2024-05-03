// Original file: src/relayer/packet.proto

import type { Meta as _packet_Meta, Meta__Output as _packet_Meta__Output } from './Meta';

export interface Packet {
  'data'?: (Buffer | Uint8Array | string);
  'meta'?: (_packet_Meta | null);
}

export interface Packet__Output {
  'data': (Buffer);
  'meta': (_packet_Meta__Output | null);
}
