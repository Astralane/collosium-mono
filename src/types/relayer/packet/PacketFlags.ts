// Original file: src/relayer/packet.proto


export interface PacketFlags {
  'discard'?: (boolean);
  'forwarded'?: (boolean);
  'repair'?: (boolean);
  'simpleVoteTx'?: (boolean);
  'tracerPacket'?: (boolean);
}

export interface PacketFlags__Output {
  'discard': (boolean);
  'forwarded': (boolean);
  'repair': (boolean);
  'simpleVoteTx': (boolean);
  'tracerPacket': (boolean);
}
