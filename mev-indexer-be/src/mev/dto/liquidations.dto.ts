import { Expose } from 'class-transformer';

export class ILiquidationDTO {
  @Expose()
  block_date: string;
  @Expose()
  block_time: number;
  @Expose()
  block_slot: number;
  @Expose()
  tx_id: string;
  @Expose()
  signer: string;
  @Expose()
  pool_address: string;
  @Expose()
  base_mint: string;
  @Expose()
  quote_mint: string;
  @Expose()
  base_vault: string;
  @Expose()
  quote_vault: string;
  @Expose()
  quote_amount: number;
  @Expose()
  base_amount: number;
  @Expose()
  is_inner_instruction: boolean;
  @Expose()
  instruction_index: number;
  @Expose()
  instruction_type: string;
  @Expose()
  inner_instruxtion_index: number;
  @Expose()
  outer_program: string;
  @Expose()
  inner_program: string;
  @Expose()
  txn_fee: number;
  @Expose()
  signer_sol_change: number;
  @Expose()
  liquidator: string;
  @Expose()
  obligation: string;
  @Expose()
  liquidity_amount: number;
  @Expose()
  min_acceptable_received_liquidity_amount: number;
  @Expose()
  max_allowed_ltv_override_percent: number;
  @Expose()
  is_err: number;
  @Expose()
  borrow_token: string;
  @Expose()
  borrow_amount: number;
  @Expose()
  borrow_value: number;
  @Expose()
  value_bf: number;
  @Expose()
  deposit_token: string;
  @Expose()
  deposit_amount: number;
  @Expose()
  deposit_value: number;
  @Expose()
  amount: number;
  @Expose()
  max_allowed_ltv_override_percents: number;
  @Expose()
  liquidation_close_factor_pct: number;
  @Expose()
  liquidation_max_value: number;
  @Expose()
  borrowed_value: number;
  @Expose()
  unhealthy_borrow_value: number;
  @Expose()
  ltv: number;
  @Expose()
  max_allowed_ltv_user: number;
  @Expose()
  max_allowed_ltv_override: number;
  @Expose()
  liquidator_repaid: number;
  @Expose()
  withdrew: number;
  @Expose()
  fees: number;
  @Expose()
  err_code: string;
  @Expose()
  err_message: string;
  @Expose()
  deposit_mint: string;
  @Expose()
  borrow_mint: string;
}

export class ILiquidationCountsDTO {
  @Expose()
  total: number;
  @Expose()
  total_signers: number;
}
