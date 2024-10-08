import { queryClient } from "@/app/provider";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

const useStartBackfill = () =>
  useMutation({
    mutationFn: (id: string) =>
      axios.post(
        `http://a4-server:4002/index/${id}/backfill`,
        {
          actionType: "start",
        },
        {
          headers: {
            "x-api-key":
              "b2f9d58511806a5a142e99fe42c44c0eb91221d04227e28145e818a110c5e64f",
          },
        }
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["FETCH_BACKFILL"] });
    },
  });

export default useStartBackfill;
