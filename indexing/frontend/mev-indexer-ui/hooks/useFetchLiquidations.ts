import queryKeys from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchLiquidations = (page: number) =>
  useQuery<number, unknown, TLiquidations[]>({
    queryKey: [queryKeys.liquidations, page],
    queryFn: () => fetchLiquidations(page),
  });

const fetchLiquidations = async (page: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BE_URL}/mev/liquidations?limit=10&offset=${
      page * 10
    }`
  );
  return data;
};

export default useFetchLiquidations;

export interface TLiquidations {
  block_date: string;
  block_time: number;
  block_slot: number;
  tx_id: string;
  signer: string;
  pool_address: string;
  base_mint: string;
  quote_mint: string;
  base_vault: string;
  quote_vault: string;
  quote_amount: number;
  base_amount: number;
  is_inner_instruction: boolean;
  instruction_index: number;
  instruction_type: string;
  inner_instruxtion_index: number;
  outer_program: string;
  inner_program: string;
  txn_fee: number;
  signer_sol_change: number;
  liquidator: string;
  obligation: string;
  liquidity_amount: number;
  min_acceptable_received_liquidity_amount: number;
  max_allowed_ltv_override_percent: number;
  is_err: number;
  borrow_token: string;
  borrow_amount: number;
  borrow_value: number;
  value_bf: number;
  deposit_token: string;
  deposit_amount: number;
  deposit_value: number;
  amount: number;
  max_allowed_ltv_override_percents: number;
  liquidation_close_factor_pct: number;
  liquidation_max_value: number;
  borrowed_value: number;
  unhealthy_borrow_value: number;
  ltv: number;
  max_allowed_ltv_user: number;
  max_allowed_ltv_override: number;
  liquidator_repaid: number;
  withdrew: number;
  fees: number;
  err_code: string;
  err_message: string;
  deposit_mint: string;
  borrow_mint: string;
}
