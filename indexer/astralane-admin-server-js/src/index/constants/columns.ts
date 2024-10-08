export const STANDARD_COLUMNS = new Map<string, string>([
  ['block_slot', 'text'],
  ['tx_id', 'text'],
  ['tx_index', 'text'],
  ['program_id', 'text'],
  ['is_inner', 'text'],
  ['data', 'text'],
  ['account_arguments', 'text'],
  ['tx_signer', 'text'],
  ['tx_success', 'text'],
  ['outer_instruction_index', 'bigint'],
  ['inner_instruction_index', 'bigint'],
  ['stack_height', 'int'],
]);

export function isCustomColumn(columnName: string): boolean {
  return !STANDARD_COLUMNS.has(columnName) && !matchOthers(columnName);
}

export function getColumnType(columnName: string): string {
  if (STANDARD_COLUMNS.has(columnName)) {
    return STANDARD_COLUMNS.get(columnName) as string;
  }
  return matchOthers(columnName);
}

function matchOthers(columnName: string): string {
  if (columnName.startsWith('account_') || columnName.startsWith('arg_')) {
    return 'text';
  } else if (columnName === 'instruction_name') {
    return 'text';
  } else {
    throw new Error(`Unknown column name ${columnName}`);
  }
}
