// Original file: src/geyser/confirmed_block.proto

import type { InnerInstruction as _solana_storage_ConfirmedBlock_InnerInstruction, InnerInstruction__Output as _solana_storage_ConfirmedBlock_InnerInstruction__Output } from './InnerInstruction';

export interface InnerInstructions {
  'index'?: (number);
  'instructions'?: (_solana_storage_ConfirmedBlock_InnerInstruction)[];
}

export interface InnerInstructions__Output {
  'index': (number);
  'instructions': (_solana_storage_ConfirmedBlock_InnerInstruction__Output)[];
}
