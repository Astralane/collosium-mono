import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { RelayerClient as _relayer_RelayerClient, RelayerDefinition as _relayer_RelayerDefinition } from './relayer/Relayer';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition
    }
  }
  packet: {
    Meta: MessageTypeDefinition
    Packet: MessageTypeDefinition
    PacketBatch: MessageTypeDefinition
    PacketFlags: MessageTypeDefinition
  }
  relayer: {
    GetTpuConfigsRequest: MessageTypeDefinition
    GetTpuConfigsResponse: MessageTypeDefinition
    Relayer: SubtypeConstructor<typeof grpc.Client, _relayer_RelayerClient> & { service: _relayer_RelayerDefinition }
    SubscribeClientPacketsRequest: MessageTypeDefinition
    SubscribePacketsRequest: MessageTypeDefinition
    SubscribePacketsResponse: MessageTypeDefinition
  }
  shared: {
    Header: MessageTypeDefinition
    Heartbeat: MessageTypeDefinition
    Socket: MessageTypeDefinition
  }
}

