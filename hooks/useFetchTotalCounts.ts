import queryKeys from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchTotalCounts = () =>
  useQuery<unknown, unknown, TotalCountsResult>({
    queryKey: [queryKeys.summaryTotalCount],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/mev/totalCounts`
      );
      return data;
    },
  });

export default useFetchTotalCounts;

export interface TotalCountsResult {
  original_count: number;
  total_attackers: number;
  total_victims: number;
}
