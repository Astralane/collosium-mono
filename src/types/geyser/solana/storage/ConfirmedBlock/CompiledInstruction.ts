// Original file: src/geyser/confirmed_block.proto


export interface CompiledInstruction {
  'programIdIndex'?: (number);
  'accounts'?: (Buffer | Uint8Array | string);
  'data'?: (Buffer | Uint8Array | string);
}

export interface CompiledInstruction__Output {
  'programIdIndex': (number);
  'accounts': (Buffer);
  'data': (Buffer);
}
