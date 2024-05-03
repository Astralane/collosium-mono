// Original file: src/geyser/confirmed_block.proto

import type { Message as _solana_storage_ConfirmedBlock_Message, Message__Output as _solana_storage_ConfirmedBlock_Message__Output } from './Message';

export interface Transaction {
  'signatures'?: (Buffer | Uint8Array | string)[];
  'message'?: (_solana_storage_ConfirmedBlock_Message | null);
}

export interface Transaction__Output {
  'signatures': (Buffer)[];
  'message': (_solana_storage_ConfirmedBlock_Message__Output | null);
}
