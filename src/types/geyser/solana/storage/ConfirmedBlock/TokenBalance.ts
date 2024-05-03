// Original file: src/geyser/confirmed_block.proto

import type { UiTokenAmount as _solana_storage_ConfirmedBlock_UiTokenAmount, UiTokenAmount__Output as _solana_storage_ConfirmedBlock_UiTokenAmount__Output } from './UiTokenAmount';

export interface TokenBalance {
  'accountIndex'?: (number);
  'mint'?: (string);
  'uiTokenAmount'?: (_solana_storage_ConfirmedBlock_UiTokenAmount | null);
  'owner'?: (string);
  'programId'?: (string);
}

export interface TokenBalance__Output {
  'accountIndex': (number);
  'mint': (string);
  'uiTokenAmount': (_solana_storage_ConfirmedBlock_UiTokenAmount__Output | null);
  'owner': (string);
  'programId': (string);
}
