// Original file: src/geyser/geyser.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EmptyRequest as _solana_geyser_EmptyRequest, EmptyRequest__Output as _solana_geyser_EmptyRequest__Output } from './EmptyRequest';
import type { GetHeartbeatIntervalResponse as _solana_geyser_GetHeartbeatIntervalResponse, GetHeartbeatIntervalResponse__Output as _solana_geyser_GetHeartbeatIntervalResponse__Output } from './GetHeartbeatIntervalResponse';
import type { MaybePartialAccountUpdate as _solana_geyser_MaybePartialAccountUpdate, MaybePartialAccountUpdate__Output as _solana_geyser_MaybePartialAccountUpdate__Output } from './MaybePartialAccountUpdate';
import type { SubscribeAccountUpdatesRequest as _solana_geyser_SubscribeAccountUpdatesRequest, SubscribeAccountUpdatesRequest__Output as _solana_geyser_SubscribeAccountUpdatesRequest__Output } from './SubscribeAccountUpdatesRequest';
import type { SubscribeBlockUpdatesRequest as _solana_geyser_SubscribeBlockUpdatesRequest, SubscribeBlockUpdatesRequest__Output as _solana_geyser_SubscribeBlockUpdatesRequest__Output } from './SubscribeBlockUpdatesRequest';
import type { SubscribePartialAccountUpdatesRequest as _solana_geyser_SubscribePartialAccountUpdatesRequest, SubscribePartialAccountUpdatesRequest__Output as _solana_geyser_SubscribePartialAccountUpdatesRequest__Output } from './SubscribePartialAccountUpdatesRequest';
import type { SubscribeProgramsUpdatesRequest as _solana_geyser_SubscribeProgramsUpdatesRequest, SubscribeProgramsUpdatesRequest__Output as _solana_geyser_SubscribeProgramsUpdatesRequest__Output } from './SubscribeProgramsUpdatesRequest';
import type { SubscribeSlotUpdateRequest as _solana_geyser_SubscribeSlotUpdateRequest, SubscribeSlotUpdateRequest__Output as _solana_geyser_SubscribeSlotUpdateRequest__Output } from './SubscribeSlotUpdateRequest';
import type { SubscribeTransactionUpdatesRequest as _solana_geyser_SubscribeTransactionUpdatesRequest, SubscribeTransactionUpdatesRequest__Output as _solana_geyser_SubscribeTransactionUpdatesRequest__Output } from './SubscribeTransactionUpdatesRequest';
import type { TimestampedAccountUpdate as _solana_geyser_TimestampedAccountUpdate, TimestampedAccountUpdate__Output as _solana_geyser_TimestampedAccountUpdate__Output } from './TimestampedAccountUpdate';
import type { TimestampedBlockUpdate as _solana_geyser_TimestampedBlockUpdate, TimestampedBlockUpdate__Output as _solana_geyser_TimestampedBlockUpdate__Output } from './TimestampedBlockUpdate';
import type { TimestampedSlotUpdate as _solana_geyser_TimestampedSlotUpdate, TimestampedSlotUpdate__Output as _solana_geyser_TimestampedSlotUpdate__Output } from './TimestampedSlotUpdate';
import type { TimestampedTransactionUpdate as _solana_geyser_TimestampedTransactionUpdate, TimestampedTransactionUpdate__Output as _solana_geyser_TimestampedTransactionUpdate__Output } from './TimestampedTransactionUpdate';

export interface GeyserClient extends grpc.Client {
  GetHeartbeatInterval(argument: _solana_geyser_EmptyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_solana_geyser_GetHeartbeatIntervalResponse__Output>): grpc.ClientUnaryCall;
  GetHeartbeatInterval(argument: _solana_geyser_EmptyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_solana_geyser_GetHeartbeatIntervalResponse__Output>): grpc.ClientUnaryCall;
  GetHeartbeatInterval(argument: _solana_geyser_EmptyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_solana_geyser_GetHeartbeatIntervalResponse__Output>): grpc.ClientUnaryCall;
  GetHeartbeatInterval(argument: _solana_geyser_EmptyRequest, callback: grpc.requestCallback<_solana_geyser_GetHeartbeatIntervalResponse__Output>): grpc.ClientUnaryCall;
  getHeartbeatInterval(argument: _solana_geyser_EmptyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_solana_geyser_GetHeartbeatIntervalResponse__Output>): grpc.ClientUnaryCall;
  getHeartbeatInterval(argument: _solana_geyser_EmptyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_solana_geyser_GetHeartbeatIntervalResponse__Output>): grpc.ClientUnaryCall;
  getHeartbeatInterval(argument: _solana_geyser_EmptyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_solana_geyser_GetHeartbeatIntervalResponse__Output>): grpc.ClientUnaryCall;
  getHeartbeatInterval(argument: _solana_geyser_EmptyRequest, callback: grpc.requestCallback<_solana_geyser_GetHeartbeatIntervalResponse__Output>): grpc.ClientUnaryCall;
  
  SubscribeAccountUpdates(argument: _solana_geyser_SubscribeAccountUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedAccountUpdate__Output>;
  SubscribeAccountUpdates(argument: _solana_geyser_SubscribeAccountUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedAccountUpdate__Output>;
  subscribeAccountUpdates(argument: _solana_geyser_SubscribeAccountUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedAccountUpdate__Output>;
  subscribeAccountUpdates(argument: _solana_geyser_SubscribeAccountUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedAccountUpdate__Output>;
  
  SubscribeBlockUpdates(argument: _solana_geyser_SubscribeBlockUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedBlockUpdate__Output>;
  SubscribeBlockUpdates(argument: _solana_geyser_SubscribeBlockUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedBlockUpdate__Output>;
  subscribeBlockUpdates(argument: _solana_geyser_SubscribeBlockUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedBlockUpdate__Output>;
  subscribeBlockUpdates(argument: _solana_geyser_SubscribeBlockUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedBlockUpdate__Output>;
  
  SubscribePartialAccountUpdates(argument: _solana_geyser_SubscribePartialAccountUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_MaybePartialAccountUpdate__Output>;
  SubscribePartialAccountUpdates(argument: _solana_geyser_SubscribePartialAccountUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_MaybePartialAccountUpdate__Output>;
  subscribePartialAccountUpdates(argument: _solana_geyser_SubscribePartialAccountUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_MaybePartialAccountUpdate__Output>;
  subscribePartialAccountUpdates(argument: _solana_geyser_SubscribePartialAccountUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_MaybePartialAccountUpdate__Output>;
  
  SubscribeProgramUpdates(argument: _solana_geyser_SubscribeProgramsUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedAccountUpdate__Output>;
  SubscribeProgramUpdates(argument: _solana_geyser_SubscribeProgramsUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedAccountUpdate__Output>;
  subscribeProgramUpdates(argument: _solana_geyser_SubscribeProgramsUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedAccountUpdate__Output>;
  subscribeProgramUpdates(argument: _solana_geyser_SubscribeProgramsUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedAccountUpdate__Output>;
  
  SubscribeSlotUpdates(argument: _solana_geyser_SubscribeSlotUpdateRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedSlotUpdate__Output>;
  SubscribeSlotUpdates(argument: _solana_geyser_SubscribeSlotUpdateRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedSlotUpdate__Output>;
  subscribeSlotUpdates(argument: _solana_geyser_SubscribeSlotUpdateRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedSlotUpdate__Output>;
  subscribeSlotUpdates(argument: _solana_geyser_SubscribeSlotUpdateRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedSlotUpdate__Output>;
  
  SubscribeTransactionUpdates(argument: _solana_geyser_SubscribeTransactionUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedTransactionUpdate__Output>;
  SubscribeTransactionUpdates(argument: _solana_geyser_SubscribeTransactionUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedTransactionUpdate__Output>;
  subscribeTransactionUpdates(argument: _solana_geyser_SubscribeTransactionUpdatesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedTransactionUpdate__Output>;
  subscribeTransactionUpdates(argument: _solana_geyser_SubscribeTransactionUpdatesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_solana_geyser_TimestampedTransactionUpdate__Output>;
  
}

export interface GeyserHandlers extends grpc.UntypedServiceImplementation {
  GetHeartbeatInterval: grpc.handleUnaryCall<_solana_geyser_EmptyRequest__Output, _solana_geyser_GetHeartbeatIntervalResponse>;
  
  SubscribeAccountUpdates: grpc.handleServerStreamingCall<_solana_geyser_SubscribeAccountUpdatesRequest__Output, _solana_geyser_TimestampedAccountUpdate>;
  
  SubscribeBlockUpdates: grpc.handleServerStreamingCall<_solana_geyser_SubscribeBlockUpdatesRequest__Output, _solana_geyser_TimestampedBlockUpdate>;
  
  SubscribePartialAccountUpdates: grpc.handleServerStreamingCall<_solana_geyser_SubscribePartialAccountUpdatesRequest__Output, _solana_geyser_MaybePartialAccountUpdate>;
  
  SubscribeProgramUpdates: grpc.handleServerStreamingCall<_solana_geyser_SubscribeProgramsUpdatesRequest__Output, _solana_geyser_TimestampedAccountUpdate>;
  
  SubscribeSlotUpdates: grpc.handleServerStreamingCall<_solana_geyser_SubscribeSlotUpdateRequest__Output, _solana_geyser_TimestampedSlotUpdate>;
  
  SubscribeTransactionUpdates: grpc.handleServerStreamingCall<_solana_geyser_SubscribeTransactionUpdatesRequest__Output, _solana_geyser_TimestampedTransactionUpdate>;
  
}

export interface GeyserDefinition extends grpc.ServiceDefinition {
  GetHeartbeatInterval: MethodDefinition<_solana_geyser_EmptyRequest, _solana_geyser_GetHeartbeatIntervalResponse, _solana_geyser_EmptyRequest__Output, _solana_geyser_GetHeartbeatIntervalResponse__Output>
  SubscribeAccountUpdates: MethodDefinition<_solana_geyser_SubscribeAccountUpdatesRequest, _solana_geyser_TimestampedAccountUpdate, _solana_geyser_SubscribeAccountUpdatesRequest__Output, _solana_geyser_TimestampedAccountUpdate__Output>
  SubscribeBlockUpdates: MethodDefinition<_solana_geyser_SubscribeBlockUpdatesRequest, _solana_geyser_TimestampedBlockUpdate, _solana_geyser_SubscribeBlockUpdatesRequest__Output, _solana_geyser_TimestampedBlockUpdate__Output>
  SubscribePartialAccountUpdates: MethodDefinition<_solana_geyser_SubscribePartialAccountUpdatesRequest, _solana_geyser_MaybePartialAccountUpdate, _solana_geyser_SubscribePartialAccountUpdatesRequest__Output, _solana_geyser_MaybePartialAccountUpdate__Output>
  SubscribeProgramUpdates: MethodDefinition<_solana_geyser_SubscribeProgramsUpdatesRequest, _solana_geyser_TimestampedAccountUpdate, _solana_geyser_SubscribeProgramsUpdatesRequest__Output, _solana_geyser_TimestampedAccountUpdate__Output>
  SubscribeSlotUpdates: MethodDefinition<_solana_geyser_SubscribeSlotUpdateRequest, _solana_geyser_TimestampedSlotUpdate, _solana_geyser_SubscribeSlotUpdateRequest__Output, _solana_geyser_TimestampedSlotUpdate__Output>
  SubscribeTransactionUpdates: MethodDefinition<_solana_geyser_SubscribeTransactionUpdatesRequest, _solana_geyser_TimestampedTransactionUpdate, _solana_geyser_SubscribeTransactionUpdatesRequest__Output, _solana_geyser_TimestampedTransactionUpdate__Output>
}
