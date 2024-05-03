// Original file: src/relayer/relayer.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetTpuConfigsRequest as _relayer_GetTpuConfigsRequest, GetTpuConfigsRequest__Output as _relayer_GetTpuConfigsRequest__Output } from './GetTpuConfigsRequest';
import type { GetTpuConfigsResponse as _relayer_GetTpuConfigsResponse, GetTpuConfigsResponse__Output as _relayer_GetTpuConfigsResponse__Output } from './GetTpuConfigsResponse';
import type { SubscribePacketsRequest as _relayer_SubscribePacketsRequest, SubscribePacketsRequest__Output as _relayer_SubscribePacketsRequest__Output } from './SubscribePacketsRequest';
import type { SubscribePacketsResponse as _relayer_SubscribePacketsResponse, SubscribePacketsResponse__Output as _relayer_SubscribePacketsResponse__Output } from './SubscribePacketsResponse';

export interface RelayerClient extends grpc.Client {
  GetTpuConfigs(argument: _relayer_GetTpuConfigsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_relayer_GetTpuConfigsResponse__Output>): grpc.ClientUnaryCall;
  GetTpuConfigs(argument: _relayer_GetTpuConfigsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_relayer_GetTpuConfigsResponse__Output>): grpc.ClientUnaryCall;
  GetTpuConfigs(argument: _relayer_GetTpuConfigsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_relayer_GetTpuConfigsResponse__Output>): grpc.ClientUnaryCall;
  GetTpuConfigs(argument: _relayer_GetTpuConfigsRequest, callback: grpc.requestCallback<_relayer_GetTpuConfigsResponse__Output>): grpc.ClientUnaryCall;
  getTpuConfigs(argument: _relayer_GetTpuConfigsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_relayer_GetTpuConfigsResponse__Output>): grpc.ClientUnaryCall;
  getTpuConfigs(argument: _relayer_GetTpuConfigsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_relayer_GetTpuConfigsResponse__Output>): grpc.ClientUnaryCall;
  getTpuConfigs(argument: _relayer_GetTpuConfigsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_relayer_GetTpuConfigsResponse__Output>): grpc.ClientUnaryCall;
  getTpuConfigs(argument: _relayer_GetTpuConfigsRequest, callback: grpc.requestCallback<_relayer_GetTpuConfigsResponse__Output>): grpc.ClientUnaryCall;
  
  SubscribeClientPackets(argument: _relayer_SubscribePacketsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_relayer_SubscribePacketsResponse__Output>;
  SubscribeClientPackets(argument: _relayer_SubscribePacketsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_relayer_SubscribePacketsResponse__Output>;
  subscribeClientPackets(argument: _relayer_SubscribePacketsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_relayer_SubscribePacketsResponse__Output>;
  subscribeClientPackets(argument: _relayer_SubscribePacketsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_relayer_SubscribePacketsResponse__Output>;
  
  SubscribePackets(argument: _relayer_SubscribePacketsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_relayer_SubscribePacketsResponse__Output>;
  SubscribePackets(argument: _relayer_SubscribePacketsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_relayer_SubscribePacketsResponse__Output>;
  subscribePackets(argument: _relayer_SubscribePacketsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_relayer_SubscribePacketsResponse__Output>;
  subscribePackets(argument: _relayer_SubscribePacketsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_relayer_SubscribePacketsResponse__Output>;
  
}

export interface RelayerHandlers extends grpc.UntypedServiceImplementation {
  GetTpuConfigs: grpc.handleUnaryCall<_relayer_GetTpuConfigsRequest__Output, _relayer_GetTpuConfigsResponse>;
  
  SubscribeClientPackets: grpc.handleServerStreamingCall<_relayer_SubscribePacketsRequest__Output, _relayer_SubscribePacketsResponse>;
  
  SubscribePackets: grpc.handleServerStreamingCall<_relayer_SubscribePacketsRequest__Output, _relayer_SubscribePacketsResponse>;
  
}

export interface RelayerDefinition extends grpc.ServiceDefinition {
  GetTpuConfigs: MethodDefinition<_relayer_GetTpuConfigsRequest, _relayer_GetTpuConfigsResponse, _relayer_GetTpuConfigsRequest__Output, _relayer_GetTpuConfigsResponse__Output>
  SubscribeClientPackets: MethodDefinition<_relayer_SubscribePacketsRequest, _relayer_SubscribePacketsResponse, _relayer_SubscribePacketsRequest__Output, _relayer_SubscribePacketsResponse__Output>
  SubscribePackets: MethodDefinition<_relayer_SubscribePacketsRequest, _relayer_SubscribePacketsResponse, _relayer_SubscribePacketsRequest__Output, _relayer_SubscribePacketsResponse__Output>
}
