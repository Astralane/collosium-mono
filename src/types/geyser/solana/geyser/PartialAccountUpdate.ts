// Original file: src/geyser/geyser.proto

import type { Long } from '@grpc/proto-loader';

export interface PartialAccountUpdate {
  'slot'?: (number | string | Long);
  'pubkey'?: (Buffer | Uint8Array | string);
  'owner'?: (Buffer | Uint8Array | string);
  'isStartup'?: (boolean);
  'seq'?: (number | string | Long);
  'txSignature'?: (string);
  'replicaVersion'?: (number);
  '_txSignature'?: "txSignature";
}

export interface PartialAccountUpdate__Output {
  'slot': (string);
  'pubkey': (Buffer);
  'owner': (Buffer);
  'isStartup': (boolean);
  'seq': (string);
  'txSignature'?: (string);
  'replicaVersion': (number);
  '_txSignature': "txSignature";
}
