// Original file: src/relayer/shared.proto

import type { Long } from '@grpc/proto-loader';

export interface Heartbeat {
  'count'?: (number | string | Long);
}

export interface Heartbeat__Output {
  'count': (string);
}
