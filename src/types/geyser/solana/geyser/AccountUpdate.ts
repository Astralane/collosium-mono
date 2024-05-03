// Original file: src/geyser/geyser.proto

import type { Long } from '@grpc/proto-loader';

export interface AccountUpdate {
  'slot'?: (number | string | Long);
  'pubkey'?: (Buffer | Uint8Array | string);
  'lamports'?: (number | string | Long);
  'owner'?: (Buffer | Uint8Array | string);
  'isExecutable'?: (boolean);
  'rentEpoch'?: (number | string | Long);
  'data'?: (Buffer | Uint8Array | string);
  'seq'?: (number | string | Long);
  'isStartup'?: (boolean);
  'txSignature'?: (string);
  'replicaVersion'?: (number);
  '_txSignature'?: "txSignature";
}

export interface AccountUpdate__Output {
  'slot': (string);
  'pubkey': (Buffer);
  'lamports': (string);
  'owner': (Buffer);
  'isExecutable': (boolean);
  'rentEpoch': (string);
  'data': (Buffer);
  'seq': (string);
  'isStartup': (boolean);
  'txSignature'?: (string);
  'replicaVersion': (number);
  '_txSignature': "txSignature";
}
