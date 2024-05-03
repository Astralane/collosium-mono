// Original file: src/relayer/shared.proto

import type { Long } from '@grpc/proto-loader';

export interface Socket {
  'ip'?: (string);
  'port'?: (number | string | Long);
}

export interface Socket__Output {
  'ip': (string);
  'port': (string);
}
