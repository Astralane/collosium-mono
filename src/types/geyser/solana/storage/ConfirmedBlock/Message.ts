// Original file: src/geyser/confirmed_block.proto

import type { MessageHeader as _solana_storage_ConfirmedBlock_MessageHeader, MessageHeader__Output as _solana_storage_ConfirmedBlock_MessageHeader__Output } from './MessageHeader';
import type { CompiledInstruction as _solana_storage_ConfirmedBlock_CompiledInstruction, CompiledInstruction__Output as _solana_storage_ConfirmedBlock_CompiledInstruction__Output } from './CompiledInstruction';
import type { MessageAddressTableLookup as _solana_storage_ConfirmedBlock_MessageAddressTableLookup, MessageAddressTableLookup__Output as _solana_storage_ConfirmedBlock_MessageAddressTableLookup__Output } from './MessageAddressTableLookup';

export interface Message {
  'header'?: (_solana_storage_ConfirmedBlock_MessageHeader | null);
  'accountKeys'?: (Buffer | Uint8Array | string)[];
  'recentBlockhash'?: (Buffer | Uint8Array | string);
  'instructions'?: (_solana_storage_ConfirmedBlock_CompiledInstruction)[];
  'versioned'?: (boolean);
  'addressTableLookups'?: (_solana_storage_ConfirmedBlock_MessageAddressTableLookup)[];
}

export interface Message__Output {
  'header': (_solana_storage_ConfirmedBlock_MessageHeader__Output | null);
  'accountKeys': (Buffer)[];
  'recentBlockhash': (Buffer);
  'instructions': (_solana_storage_ConfirmedBlock_CompiledInstruction__Output)[];
  'versioned': (boolean);
  'addressTableLookups': (_solana_storage_ConfirmedBlock_MessageAddressTableLookup__Output)[];
}
