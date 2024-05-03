// Original file: src/geyser/confirmed_block.proto

import type { Long } from '@grpc/proto-loader';

export interface BlockHeight {
  'blockHeight'?: (number | string | Long);
}

export interface BlockHeight__Output {
  'blockHeight': (string);
}
