// Original file: src/geyser/confirmed_block.proto

import type { Long } from '@grpc/proto-loader';

export interface UnixTimestamp {
  'timestamp'?: (number | string | Long);
}

export interface UnixTimestamp__Output {
  'timestamp': (string);
}
