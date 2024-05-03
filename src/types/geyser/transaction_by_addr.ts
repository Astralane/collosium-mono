import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  solana: {
    storage: {
      TransactionByAddr: {
        CustomError: MessageTypeDefinition
        InstructionError: MessageTypeDefinition
        InstructionErrorType: EnumTypeDefinition
        Memo: MessageTypeDefinition
        TransactionByAddr: MessageTypeDefinition
        TransactionByAddrInfo: MessageTypeDefinition
        TransactionDetails: MessageTypeDefinition
        TransactionError: MessageTypeDefinition
        TransactionErrorType: EnumTypeDefinition
        UnixTimestamp: MessageTypeDefinition
      }
    }
  }
}

