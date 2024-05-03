// Original file: src/geyser/transaction_by_addr.proto

export const InstructionErrorType = {
  GENERIC_ERROR: 'GENERIC_ERROR',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  INVALID_INSTRUCTION_DATA: 'INVALID_INSTRUCTION_DATA',
  INVALID_ACCOUNT_DATA: 'INVALID_ACCOUNT_DATA',
  ACCOUNT_DATA_TOO_SMALL: 'ACCOUNT_DATA_TOO_SMALL',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INCORRECT_PROGRAM_ID: 'INCORRECT_PROGRAM_ID',
  MISSING_REQUIRED_SIGNATURE: 'MISSING_REQUIRED_SIGNATURE',
  ACCOUNT_ALREADY_INITIALIZED: 'ACCOUNT_ALREADY_INITIALIZED',
  UNINITIALIZED_ACCOUNT: 'UNINITIALIZED_ACCOUNT',
  UNBALANCED_INSTRUCTION: 'UNBALANCED_INSTRUCTION',
  MODIFIED_PROGRAM_ID: 'MODIFIED_PROGRAM_ID',
  EXTERNAL_ACCOUNT_LAMPORT_SPEND: 'EXTERNAL_ACCOUNT_LAMPORT_SPEND',
  EXTERNAL_ACCOUNT_DATA_MODIFIED: 'EXTERNAL_ACCOUNT_DATA_MODIFIED',
  READONLY_LAMPORT_CHANGE: 'READONLY_LAMPORT_CHANGE',
  READONLY_DATA_MODIFIED: 'READONLY_DATA_MODIFIED',
  DUPLICATE_ACCOUNT_INDEX: 'DUPLICATE_ACCOUNT_INDEX',
  EXECUTABLE_MODIFIED: 'EXECUTABLE_MODIFIED',
  RENT_EPOCH_MODIFIED: 'RENT_EPOCH_MODIFIED',
  NOT_ENOUGH_ACCOUNT_KEYS: 'NOT_ENOUGH_ACCOUNT_KEYS',
  ACCOUNT_DATA_SIZE_CHANGED: 'ACCOUNT_DATA_SIZE_CHANGED',
  ACCOUNT_NOT_EXECUTABLE: 'ACCOUNT_NOT_EXECUTABLE',
  ACCOUNT_BORROW_FAILED: 'ACCOUNT_BORROW_FAILED',
  ACCOUNT_BORROW_OUTSTANDING: 'ACCOUNT_BORROW_OUTSTANDING',
  DUPLICATE_ACCOUNT_OUT_OF_SYNC: 'DUPLICATE_ACCOUNT_OUT_OF_SYNC',
  CUSTOM: 'CUSTOM',
  INVALID_ERROR: 'INVALID_ERROR',
  EXECUTABLE_DATA_MODIFIED: 'EXECUTABLE_DATA_MODIFIED',
  EXECUTABLE_LAMPORT_CHANGE: 'EXECUTABLE_LAMPORT_CHANGE',
  EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT: 'EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT',
  UNSUPPORTED_PROGRAM_ID: 'UNSUPPORTED_PROGRAM_ID',
  CALL_DEPTH: 'CALL_DEPTH',
  MISSING_ACCOUNT: 'MISSING_ACCOUNT',
  REENTRANCY_NOT_ALLOWED: 'REENTRANCY_NOT_ALLOWED',
  MAX_SEED_LENGTH_EXCEEDED: 'MAX_SEED_LENGTH_EXCEEDED',
  INVALID_SEEDS: 'INVALID_SEEDS',
  INVALID_REALLOC: 'INVALID_REALLOC',
  COMPUTATIONAL_BUDGET_EXCEEDED: 'COMPUTATIONAL_BUDGET_EXCEEDED',
  PRIVILEGE_ESCALATION: 'PRIVILEGE_ESCALATION',
  PROGRAM_ENVIRONMENT_SETUP_FAILURE: 'PROGRAM_ENVIRONMENT_SETUP_FAILURE',
  PROGRAM_FAILED_TO_COMPLETE: 'PROGRAM_FAILED_TO_COMPLETE',
  PROGRAM_FAILED_TO_COMPILE: 'PROGRAM_FAILED_TO_COMPILE',
  IMMUTABLE: 'IMMUTABLE',
  INCORRECT_AUTHORITY: 'INCORRECT_AUTHORITY',
  BORSH_IO_ERROR: 'BORSH_IO_ERROR',
  ACCOUNT_NOT_RENT_EXEMPT: 'ACCOUNT_NOT_RENT_EXEMPT',
  INVALID_ACCOUNT_OWNER: 'INVALID_ACCOUNT_OWNER',
  ARITHMETIC_OVERFLOW: 'ARITHMETIC_OVERFLOW',
  UNSUPPORTED_SYSVAR: 'UNSUPPORTED_SYSVAR',
  ILLEGAL_OWNER: 'ILLEGAL_OWNER',
  MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED: 'MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED',
  MAX_ACCOUNTS_EXCEEDED: 'MAX_ACCOUNTS_EXCEEDED',
  MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED: 'MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED',
  BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS: 'BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS',
} as const;

export type InstructionErrorType =
  | 'GENERIC_ERROR'
  | 0
  | 'INVALID_ARGUMENT'
  | 1
  | 'INVALID_INSTRUCTION_DATA'
  | 2
  | 'INVALID_ACCOUNT_DATA'
  | 3
  | 'ACCOUNT_DATA_TOO_SMALL'
  | 4
  | 'INSUFFICIENT_FUNDS'
  | 5
  | 'INCORRECT_PROGRAM_ID'
  | 6
  | 'MISSING_REQUIRED_SIGNATURE'
  | 7
  | 'ACCOUNT_ALREADY_INITIALIZED'
  | 8
  | 'UNINITIALIZED_ACCOUNT'
  | 9
  | 'UNBALANCED_INSTRUCTION'
  | 10
  | 'MODIFIED_PROGRAM_ID'
  | 11
  | 'EXTERNAL_ACCOUNT_LAMPORT_SPEND'
  | 12
  | 'EXTERNAL_ACCOUNT_DATA_MODIFIED'
  | 13
  | 'READONLY_LAMPORT_CHANGE'
  | 14
  | 'READONLY_DATA_MODIFIED'
  | 15
  | 'DUPLICATE_ACCOUNT_INDEX'
  | 16
  | 'EXECUTABLE_MODIFIED'
  | 17
  | 'RENT_EPOCH_MODIFIED'
  | 18
  | 'NOT_ENOUGH_ACCOUNT_KEYS'
  | 19
  | 'ACCOUNT_DATA_SIZE_CHANGED'
  | 20
  | 'ACCOUNT_NOT_EXECUTABLE'
  | 21
  | 'ACCOUNT_BORROW_FAILED'
  | 22
  | 'ACCOUNT_BORROW_OUTSTANDING'
  | 23
  | 'DUPLICATE_ACCOUNT_OUT_OF_SYNC'
  | 24
  | 'CUSTOM'
  | 25
  | 'INVALID_ERROR'
  | 26
  | 'EXECUTABLE_DATA_MODIFIED'
  | 27
  | 'EXECUTABLE_LAMPORT_CHANGE'
  | 28
  | 'EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT'
  | 29
  | 'UNSUPPORTED_PROGRAM_ID'
  | 30
  | 'CALL_DEPTH'
  | 31
  | 'MISSING_ACCOUNT'
  | 32
  | 'REENTRANCY_NOT_ALLOWED'
  | 33
  | 'MAX_SEED_LENGTH_EXCEEDED'
  | 34
  | 'INVALID_SEEDS'
  | 35
  | 'INVALID_REALLOC'
  | 36
  | 'COMPUTATIONAL_BUDGET_EXCEEDED'
  | 37
  | 'PRIVILEGE_ESCALATION'
  | 38
  | 'PROGRAM_ENVIRONMENT_SETUP_FAILURE'
  | 39
  | 'PROGRAM_FAILED_TO_COMPLETE'
  | 40
  | 'PROGRAM_FAILED_TO_COMPILE'
  | 41
  | 'IMMUTABLE'
  | 42
  | 'INCORRECT_AUTHORITY'
  | 43
  | 'BORSH_IO_ERROR'
  | 44
  | 'ACCOUNT_NOT_RENT_EXEMPT'
  | 45
  | 'INVALID_ACCOUNT_OWNER'
  | 46
  | 'ARITHMETIC_OVERFLOW'
  | 47
  | 'UNSUPPORTED_SYSVAR'
  | 48
  | 'ILLEGAL_OWNER'
  | 49
  | 'MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED'
  | 50
  | 'MAX_ACCOUNTS_EXCEEDED'
  | 51
  | 'MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED'
  | 52
  | 'BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS'
  | 53

export type InstructionErrorType__Output = typeof InstructionErrorType[keyof typeof InstructionErrorType]
