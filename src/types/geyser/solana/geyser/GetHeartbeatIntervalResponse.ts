// Original file: src/geyser/geyser.proto

import type { Long } from '@grpc/proto-loader';

export interface GetHeartbeatIntervalResponse {
  'heartbeatIntervalMs'?: (number | string | Long);
}

export interface GetHeartbeatIntervalResponse__Output {
  'heartbeatIntervalMs': (string);
}
