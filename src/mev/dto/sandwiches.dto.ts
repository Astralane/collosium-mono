import { Expose } from 'class-transformer';

export class ISandwichesDTO {
  @Expose()
  frontrun_tx_id: string;
  @Expose()
  slot: number;
  @Expose()
  'frontrun_swaps.block_slot': number[];
  @Expose()
  'frontrun_swaps.tx_id': string[];
  @Expose()
  'frontrun_swaps.signer': string[];
  @Expose()
  'frontrun_swaps.pool_address': string[];
  @Expose()
  'frontrun_swaps.token_in': string[];
  @Expose()
  'frontrun_swaps.token_out': string[];
  @Expose()
  'frontrun_swaps.amount_in': number[];
  @Expose()
  'frontrun_swaps.amount_out': number[];
  @Expose()
  'frontrun_swaps.tx_fee': number[];
  @Expose()
  'frontrun_swaps.multi_location': string[];
  @Expose()
  'frontrun_swaps.instruction_index': number[];
  @Expose()
  'frontrun_swaps.is_inner_instruction': boolean[];
  @Expose()
  'frontrun_swaps.inner_instruction_index': number[];
  @Expose()
  'frontrun_swaps.transaction_index': number[];
  @Expose()
  'frontrun_swaps.inner_program': string[];
  @Expose()
  'frontrun_swaps.outer_program': string[];
  @Expose()
  'frontrun_swaps.priority_fee': number[];
  @Expose()
  'frontrun_swaps.block_date': string[];
  @Expose()
  'victim_swaps.block_slot': number[];
  @Expose()
  'victim_swaps.tx_id': string[];
  @Expose()
  'victim_swaps.signer': string[];
  @Expose()
  'victim_swaps.pool_address': string[];
  @Expose()
  'victim_swaps.token_in': string[];
  @Expose()
  'victim_swaps.token_out': string[];
  @Expose()
  'victim_swaps.amount_in': number[];
  @Expose()
  'victim_swaps.amount_out': number[];
  @Expose()
  'victim_swaps.tx_fee': number[];
  @Expose()
  'victim_swaps.multi_location': string[];
  @Expose()
  'victim_swaps.instruction_index': number[];
  @Expose()
  'victim_swaps.is_inner_instruction': boolean[];
  @Expose()
  'victim_swaps.inner_instruction_index': number[];
  @Expose()
  'victim_swaps.transaction_index': number[];
  @Expose()
  'victim_swaps.inner_program': string[];
  @Expose()
  'victim_swaps.outer_program': string[];
  @Expose()
  'victim_swaps.priority_fee': number[];
  @Expose()
  'victim_swaps.block_date': string[];
  @Expose()
  backrun_tx_id: string;
  @Expose()
  'backrun_swaps.block_slot': number[];
  @Expose()
  'backrun_swaps.tx_id': string[];
  @Expose()
  'backrun_swaps.signer': string[];
  @Expose()
  'backrun_swaps.pool_address': string[];
  @Expose()
  'backrun_swaps.token_in': string[];
  @Expose()
  'backrun_swaps.token_out': string[];
  @Expose()
  'backrun_swaps.amount_in': number[];
  @Expose()
  'backrun_swaps.amount_out': number[];
  @Expose()
  'backrun_swaps.tx_fee': number[];
  @Expose()
  'backrun_swaps.multi_location': string[];
  @Expose()
  'backrun_swaps.instruction_index': number[];
  @Expose()
  'backrun_swaps.is_inner_instruction': boolean[];
  @Expose()
  'backrun_swaps.inner_instruction_index': number[];
  @Expose()
  'backrun_swaps.transaction_index': number[];
  @Expose()
  'backrun_swaps.inner_program': string[];
  @Expose()
  'backrun_swaps.outer_program': string[];
  @Expose()
  'backrun_swaps.priority_fee': number[];
  @Expose()
  'backrun_swaps.block_date': string[];
}

/**
 * 
 * 
 * 	"frontrun_tx_id" : "5DutKgtRWTDNMFHcbSfPm15eJPDNfvN1shYVzzJ5mFHkXWSSuZzchvMyycYDCZ7qvg3pH8VYK2guMWnSZVHXdmLC",
		"slot" : 283581338,
		"frontrun_swaps.block_slot" : "[283581338]",
		"frontrun_swaps.tx_id" : "['5DutKgtRWTDNMFHcbSfPm15eJPDNfvN1shYVzzJ5mFHkXWSSuZzchvMyycYDCZ7qvg3pH8VYK2guMWnSZVHXdmLC']",
		"frontrun_swaps.signer" : "['ARSCioaDhR6oW7vcfEDF24XFQpedH5h6p33VxLGbkfVa']",
		"frontrun_swaps.pool_address" : "['DndU8CTUtpscngLeA4WLgJZnA6ACRp89mNydP64r3kPh']",
		"frontrun_swaps.token_in" : "['CkP15sABWWhhy9YTcoxL5KNxJuzgtAbbDJ5wcwy2pump']",
		"frontrun_swaps.token_out" : "['So11111111111111111111111111111111111111112']",
		"frontrun_swaps.amount_in" : "[5238137.85872899]",
		"frontrun_swaps.amount_out" : "[6.4895683049999775]",
		"frontrun_swaps.tx_fee" : "[5000]",
		"frontrun_swaps.multi_location" : "['5DutKgtRWTDNMFHcbSfPm15eJPDNfvN1shYVzzJ5mFHkXWSSuZzchvMyycYDCZ7qvg3pH8VYK2guMWnSZVHXdmLC\/1\/0']",
		"frontrun_swaps.instruction_index" : "[1]",
		"frontrun_swaps.is_inner_instruction" : "[false]",
		"frontrun_swaps.inner_instruction_index" : "[1]",
		"frontrun_swaps.transaction_index" : "[288]",
		"frontrun_swaps.inner_program" : "['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8']",
		"frontrun_swaps.outer_program" : "['ChXs7eqjAKr8qrsGHcnp7sBKzrDU2JE2RjMqX59ATSeH']",
		"frontrun_swaps.priority_fee" : "[0]",
		"frontrun_swaps.block_date" : "['2024-08-14']",
		"victim_swaps.block_slot" : "[283581338]",
		"victim_swaps.tx_id" : "['436jY4YFtC2HjrtJKZGtXRCUYpJdKjmxGe5Qn2qWjNy2tjcbtzbUhXYJxuhw7dqNXuaTc6NBEX7PEjX7zCTHXt8Q']",
		"victim_swaps.signer" : "['4oUgikEAqtSFnwDeQoGGiZ42AJBX7dVZCgBvrqGt2Vpa']",
		"victim_swaps.pool_address" : "['DndU8CTUtpscngLeA4WLgJZnA6ACRp89mNydP64r3kPh']",
		"victim_swaps.token_in" : "['CkP15sABWWhhy9YTcoxL5KNxJuzgtAbbDJ5wcwy2pump']",
		"victim_swaps.token_out" : "['So11111111111111111111111111111111111111112']",
		"victim_swaps.amount_in" : "[766629.3667879999]",
		"victim_swaps.amount_out" : "[1.0]",
		"victim_swaps.tx_fee" : "[605000]",
		"victim_swaps.multi_location" : "['436jY4YFtC2HjrtJKZGtXRCUYpJdKjmxGe5Qn2qWjNy2tjcbtzbUhXYJxuhw7dqNXuaTc6NBEX7PEjX7zCTHXt8Q\/4\/0']",
		"victim_swaps.instruction_index" : "[4]",
		"victim_swaps.is_inner_instruction" : "[false]",
		"victim_swaps.inner_instruction_index" : "[4]",
		"victim_swaps.transaction_index" : "[289]",
		"victim_swaps.inner_program" : "['']",
		"victim_swaps.outer_program" : "['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8']",
		"victim_swaps.priority_fee" : "[600000]",
		"victim_swaps.block_date" : "['2024-08-14']",
		"backrun_tx_id" : "5W3sMcndgyr5cZQUFMJBL6p2gsTMi43o4newxXakmq71PXyHhJddf25EANb8BBNedFUVXBDTGvEVEsGb24f7Aw8L",
		"backrun_swaps.block_slot" : "[283581338]",
		"backrun_swaps.tx_id" : "['5W3sMcndgyr5cZQUFMJBL6p2gsTMi43o4newxXakmq71PXyHhJddf25EANb8BBNedFUVXBDTGvEVEsGb24f7Aw8L']",
		"backrun_swaps.signer" : "['ARSCioaDhR6oW7vcfEDF24XFQpedH5h6p33VxLGbkfVa']",
		"backrun_swaps.pool_address" : "['DndU8CTUtpscngLeA4WLgJZnA6ACRp89mNydP64r3kPh']",
		"backrun_swaps.token_in" : "['So11111111111111111111111111111111111111112']",
		"backrun_swaps.token_out" : "['CkP15sABWWhhy9YTcoxL5KNxJuzgtAbbDJ5wcwy2pump']",
		"backrun_swaps.amount_in" : "[6.5440579979999995]",
		"backrun_swaps.amount_out" : "[5238137.85872899]",
		"backrun_swaps.tx_fee" : "[5000]",
		"backrun_swaps.multi_location" : "['5W3sMcndgyr5cZQUFMJBL6p2gsTMi43o4newxXakmq71PXyHhJddf25EANb8BBNedFUVXBDTGvEVEsGb24f7Aw8L\/1\/0']",
		"backrun_swaps.instruction_index" : "[1]",
		"backrun_swaps.is_inner_instruction" : "[false]",
		"backrun_swaps.inner_instruction_index" : "[1]",
		"backrun_swaps.transaction_index" : "[290]",
		"backrun_swaps.inner_program" : "['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8']",
		"backrun_swaps.outer_program" : "['ChXs7eqjAKr8qrsGHcnp7sBKzrDU2JE2RjMqX59ATSeH']",
		"backrun_swaps.priority_fee" : "[0]",
		"backrun_swaps.block_date" : "['2024-08-14']"
 */
