import queryKeys from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchLiquidationCounts = () =>
  useQuery<unknown, unknown, TotalCountsResult>({
    queryKey: [queryKeys.liquidationSummary],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/mev/liquidations/count`
      );
      return data;
    },
  });

export default useFetchLiquidationCounts;

export interface TotalCountsResult {
  total: number;
  total_signers: number;
}
