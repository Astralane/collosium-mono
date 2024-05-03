// Original file: src/geyser/transaction_by_addr.proto

import type { Long } from '@grpc/proto-loader';

export interface UnixTimestamp {
  'timestamp'?: (number | string | Long);
}

export interface UnixTimestamp__Output {
  'timestamp': (string);
}
