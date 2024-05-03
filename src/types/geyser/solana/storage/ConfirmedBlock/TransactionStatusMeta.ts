// Original file: src/geyser/confirmed_block.proto

import type { TransactionError as _solana_storage_ConfirmedBlock_TransactionError, TransactionError__Output as _solana_storage_ConfirmedBlock_TransactionError__Output } from './TransactionError';
import type { InnerInstructions as _solana_storage_ConfirmedBlock_InnerInstructions, InnerInstructions__Output as _solana_storage_ConfirmedBlock_InnerInstructions__Output } from './InnerInstructions';
import type { TokenBalance as _solana_storage_ConfirmedBlock_TokenBalance, TokenBalance__Output as _solana_storage_ConfirmedBlock_TokenBalance__Output } from './TokenBalance';
import type { Reward as _solana_storage_ConfirmedBlock_Reward, Reward__Output as _solana_storage_ConfirmedBlock_Reward__Output } from './Reward';
import type { ReturnData as _solana_storage_ConfirmedBlock_ReturnData, ReturnData__Output as _solana_storage_ConfirmedBlock_ReturnData__Output } from './ReturnData';
import type { Long } from '@grpc/proto-loader';

export interface TransactionStatusMeta {
  'err'?: (_solana_storage_ConfirmedBlock_TransactionError | null);
  'fee'?: (number | string | Long);
  'preBalances'?: (number | string | Long)[];
  'postBalances'?: (number | string | Long)[];
  'innerInstructions'?: (_solana_storage_ConfirmedBlock_InnerInstructions)[];
  'logMessages'?: (string)[];
  'preTokenBalances'?: (_solana_storage_ConfirmedBlock_TokenBalance)[];
  'postTokenBalances'?: (_solana_storage_ConfirmedBlock_TokenBalance)[];
  'rewards'?: (_solana_storage_ConfirmedBlock_Reward)[];
  'innerInstructionsNone'?: (boolean);
  'logMessagesNone'?: (boolean);
  'loadedWritableAddresses'?: (Buffer | Uint8Array | string)[];
  'loadedReadonlyAddresses'?: (Buffer | Uint8Array | string)[];
  'returnData'?: (_solana_storage_ConfirmedBlock_ReturnData | null);
  'returnDataNone'?: (boolean);
  'computeUnitsConsumed'?: (number | string | Long);
  '_computeUnitsConsumed'?: "computeUnitsConsumed";
}

export interface TransactionStatusMeta__Output {
  'err': (_solana_storage_ConfirmedBlock_TransactionError__Output | null);
  'fee': (string);
  'preBalances': (string)[];
  'postBalances': (string)[];
  'innerInstructions': (_solana_storage_ConfirmedBlock_InnerInstructions__Output)[];
  'logMessages': (string)[];
  'preTokenBalances': (_solana_storage_ConfirmedBlock_TokenBalance__Output)[];
  'postTokenBalances': (_solana_storage_ConfirmedBlock_TokenBalance__Output)[];
  'rewards': (_solana_storage_ConfirmedBlock_Reward__Output)[];
  'innerInstructionsNone': (boolean);
  'logMessagesNone': (boolean);
  'loadedWritableAddresses': (Buffer)[];
  'loadedReadonlyAddresses': (Buffer)[];
  'returnData': (_solana_storage_ConfirmedBlock_ReturnData__Output | null);
  'returnDataNone': (boolean);
  'computeUnitsConsumed'?: (string);
  '_computeUnitsConsumed': "computeUnitsConsumed";
}
