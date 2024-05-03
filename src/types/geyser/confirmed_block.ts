import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  solana: {
    storage: {
      ConfirmedBlock: {
        BlockHeight: MessageTypeDefinition
        CompiledInstruction: MessageTypeDefinition
        ConfirmedBlock: MessageTypeDefinition
        ConfirmedTransaction: MessageTypeDefinition
        InnerInstruction: MessageTypeDefinition
        InnerInstructions: MessageTypeDefinition
        Message: MessageTypeDefinition
        MessageAddressTableLookup: MessageTypeDefinition
        MessageHeader: MessageTypeDefinition
        ReturnData: MessageTypeDefinition
        Reward: MessageTypeDefinition
        RewardType: EnumTypeDefinition
        Rewards: MessageTypeDefinition
        TokenBalance: MessageTypeDefinition
        Transaction: MessageTypeDefinition
        TransactionError: MessageTypeDefinition
        TransactionStatusMeta: MessageTypeDefinition
        UiTokenAmount: MessageTypeDefinition
        UnixTimestamp: MessageTypeDefinition
      }
    }
  }
}

