import { TbackfillError, TbackfillStatus } from "@/app/types/common";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

const useFetchBackfill = (indexId: string) =>
  useQuery<string, TbackfillError, TbackfillStatus>({
    queryKey: ["FETCH_BACKFILL", indexId],
    queryFn: () => fetchBackfillStatus(indexId),
    enabled: !!indexId,
  });

const fetchBackfillStatus = async (indexId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STREAMING_SERVER}/index/${indexId}/backfill`,
      {
        headers: {
          "x-api-key":
            "b2f9d58511806a5a142e99fe42c44c0eb91221d04227e28145e818a110c5e64f",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorData = error.response?.data as TbackfillError;
      throw errorData;
    }
    throw error;
  }
};
export default useFetchBackfill;
