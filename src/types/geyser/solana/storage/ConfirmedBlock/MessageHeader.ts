// Original file: src/geyser/confirmed_block.proto


export interface MessageHeader {
  'numRequiredSignatures'?: (number);
  'numReadonlySignedAccounts'?: (number);
  'numReadonlyUnsignedAccounts'?: (number);
}

export interface MessageHeader__Output {
  'numRequiredSignatures': (number);
  'numReadonlySignedAccounts': (number);
  'numReadonlyUnsignedAccounts': (number);
}
