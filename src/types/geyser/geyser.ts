import type * as grpc from '@grpc/grpc-js';
import type {
  EnumTypeDefinition,
  MessageTypeDefinition,
} from '@grpc/proto-loader';

import type {
  GeyserClient as _solana_geyser_GeyserClient,
  GeyserDefinition as _solana_geyser_GeyserDefinition,
} from './solana/geyser/Geyser';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype,
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition;
    };
  };
  solana: {
    geyser: {
      AccountUpdate: MessageTypeDefinition;
      BlockUpdate: MessageTypeDefinition;
      EmptyRequest: MessageTypeDefinition;
      GetHeartbeatIntervalResponse: MessageTypeDefinition;
      Geyser: SubtypeConstructor<
        typeof grpc.Client,
        _solana_geyser_GeyserClient
      > & { service: _solana_geyser_GeyserDefinition };
      Heartbeat: MessageTypeDefinition;
      MaybePartialAccountUpdate: MessageTypeDefinition;
      PartialAccountUpdate: MessageTypeDefinition;
      SlotUpdate: MessageTypeDefinition;
      SlotUpdateStatus: EnumTypeDefinition;
      SubscribeAccountUpdatesRequest: MessageTypeDefinition;
      SubscribeBlockUpdatesRequest: MessageTypeDefinition;
      SubscribePartialAccountUpdatesRequest: MessageTypeDefinition;
      SubscribeProgramsUpdatesRequest: MessageTypeDefinition;
      SubscribeSlotUpdateRequest: MessageTypeDefinition;
      SubscribeTransactionUpdatesRequest: MessageTypeDefinition;
      TimestampedAccountUpdate: MessageTypeDefinition;
      TimestampedBlockUpdate: MessageTypeDefinition;
      TimestampedSlotUpdate: MessageTypeDefinition;
      TimestampedTransactionUpdate: MessageTypeDefinition;
      TransactionUpdate: MessageTypeDefinition;
    };
    storage: {
      ConfirmedBlock: {
        BlockHeight: MessageTypeDefinition;
        CompiledInstruction: MessageTypeDefinition;
        ConfirmedBlock: MessageTypeDefinition;
        ConfirmedTransaction: MessageTypeDefinition;
        InnerInstruction: MessageTypeDefinition;
        InnerInstructions: MessageTypeDefinition;
        Message: MessageTypeDefinition;
        MessageAddressTableLookup: MessageTypeDefinition;
        MessageHeader: MessageTypeDefinition;
        ReturnData: MessageTypeDefinition;
        Reward: MessageTypeDefinition;
        RewardType: EnumTypeDefinition;
        Rewards: MessageTypeDefinition;
        TokenBalance: MessageTypeDefinition;
        Transaction: MessageTypeDefinition;
        TransactionError: MessageTypeDefinition;
        TransactionStatusMeta: MessageTypeDefinition;
        UiTokenAmount: MessageTypeDefinition;
        UnixTimestamp: MessageTypeDefinition;
      };
    };
  };
}
