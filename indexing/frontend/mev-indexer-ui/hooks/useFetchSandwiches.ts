import queryKeys from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchSandwiches = (page: number) =>
  useQuery<number, unknown, TSandwich[]>({
    queryKey: [queryKeys.sandwiches, page],
    queryFn: () => fetchSandwiches(page),
  });

const fetchSandwiches = async (page: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BE_URL}/mev/sandwiches?limit=10&offset=${
      page * 10
    }`
  );
  return data;
};

export default useFetchSandwiches;

export type TSandwich = {
  frontrun_tx_id: string;
  slot: number;
  "frontrun_swaps.block_slot": number[];
  "frontrun_swaps.tx_id": string[];
  "frontrun_swaps.signer": string[];
  "frontrun_swaps.pool_address": string[];
  "frontrun_swaps.token_in": string[];
  "frontrun_swaps.token_out": string[];
  "frontrun_swaps.amount_in": number[];
  "frontrun_swaps.amount_out": number[];
  "frontrun_swaps.tx_fee": number[];
  "frontrun_swaps.multi_location": string[];
  "frontrun_swaps.instruction_index": number[];
  "frontrun_swaps.is_inner_instruction": boolean[];
  "frontrun_swaps.inner_instruction_index": number[];
  "frontrun_swaps.transaction_index": number[];
  "frontrun_swaps.inner_program": string[];
  "frontrun_swaps.outer_program": string[];
  "frontrun_swaps.priority_fee": number[];
  "frontrun_swaps.block_date": string[];
  "victim_swaps.block_slot": number[];
  "victim_swaps.tx_id": string[];
  "victim_swaps.signer": string[];
  "victim_swaps.pool_address": string[];
  "victim_swaps.token_in": string[];
  "victim_swaps.token_out": string[];
  "victim_swaps.amount_in": number[];
  "victim_swaps.amount_out": number[];
  "victim_swaps.tx_fee": number[];
  "victim_swaps.multi_location": string[];
  "victim_swaps.instruction_index": number[];
  "victim_swaps.is_inner_instruction": boolean[];
  "victim_swaps.inner_instruction_index": number[];
  "victim_swaps.transaction_index": number[];
  "victim_swaps.inner_program": string[];
  "victim_swaps.outer_program": string[];
  "victim_swaps.priority_fee": number[];
  "victim_swaps.block_date": string[];
  backrun_tx_id: string;
  "backrun_swaps.block_slot": number[];
  "backrun_swaps.tx_id": string[];
  "backrun_swaps.signer": string[];
  "backrun_swaps.pool_address": string[];
  "backrun_swaps.token_in": string[];
  "backrun_swaps.token_out": string[];
  "backrun_swaps.amount_in": number[];
  "backrun_swaps.amount_out": number[];
  "backrun_swaps.tx_fee": number[];
  "backrun_swaps.multi_location": string[];
  "backrun_swaps.instruction_index": number[];
  "backrun_swaps.is_inner_instruction": boolean[];
  "backrun_swaps.inner_instruction_index": number[];
  "backrun_swaps.transaction_index": number[];
  "backrun_swaps.inner_program": string[];
  "backrun_swaps.outer_program": string[];
  "backrun_swaps.priority_fee": number[];
  "backrun_swaps.block_date": string[];
};

export type TVictim = {
  "victim_swaps.block_slot": number[];
  "victim_swaps.tx_id": string[];
  "victim_swaps.signer": string[];
  "victim_swaps.pool_address": string[];
  "victim_swaps.token_in": string[];
  "victim_swaps.token_out": string[];
  "victim_swaps.amount_in": number[];
  "victim_swaps.amount_out": number[];
  "victim_swaps.tx_fee": number[];
  "victim_swaps.multi_location": string[];
  "victim_swaps.instruction_index": number[];
  "victim_swaps.is_inner_instruction": boolean[];
  "victim_swaps.inner_instruction_index": number[];
  "victim_swaps.transaction_index": number[];
  "victim_swaps.inner_program": string[];
  "victim_swaps.outer_program": string[];
  "victim_swaps.priority_fee": number[];
  "victim_swaps.block_date": string[];
};
