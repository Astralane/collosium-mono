// Define the type for a single field in an account or instruction
interface IdlField {
  name: string;
  type: string; // You might need to create a more detailed type for this
}
interface IdlArg {
  name: string;
  type: any;
}
// Define the type for an instruction in the IDL
export interface IdlInstruction {
  name: string;
  accounts: IdlAccount[];
  args: IdlArg[];
}

// Define the type for an account in the IDL
export interface IdlAccount {
  name: string;
  isMut: boolean;
  isSigner: boolean;
}

// Define the type for a custom type in the IDL
interface IdlType {
  name: string;
  type: {
    kind: string;
    fields: IdlField[];
  };
}

// Define the type for an event in the IDL
interface IdlEvent {
  name: string;
  fields: IdlField[];
}

// Define the type for an error in the IDL
interface IdlError {
  code: number;
  name: string;
  msg: string;
}

// Define the main IDL interface
export interface Idl {
  version: string;
  name: string;
  instructions: IdlInstruction[];
  accounts: IdlAccount[];
  types?: IdlType[];
  events?: IdlEvent[];
  errors?: IdlError[];
}
