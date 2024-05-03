// Original file: src/geyser/confirmed_block.proto


export interface InnerInstruction {
  'programIdIndex'?: (number);
  'accounts'?: (Buffer | Uint8Array | string);
  'data'?: (Buffer | Uint8Array | string);
  'stackHeight'?: (number);
  '_stackHeight'?: "stackHeight";
}

export interface InnerInstruction__Output {
  'programIdIndex': (number);
  'accounts': (Buffer);
  'data': (Buffer);
  'stackHeight'?: (number);
  '_stackHeight': "stackHeight";
}
