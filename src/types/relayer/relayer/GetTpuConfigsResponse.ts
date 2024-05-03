// Original file: src/relayer/relayer.proto

import type { Socket as _shared_Socket, Socket__Output as _shared_Socket__Output } from '../shared/Socket';

export interface GetTpuConfigsResponse {
  'tpu'?: (_shared_Socket | null);
  'tpuForward'?: (_shared_Socket | null);
}

export interface GetTpuConfigsResponse__Output {
  'tpu': (_shared_Socket__Output | null);
  'tpuForward': (_shared_Socket__Output | null);
}
