import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

const useCreateIndex = (handleSuccess: (data: any) => void) =>
  useMutation({
    mutationFn: (data: any) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_STREAMING_SERVER}/index`,
        {
          ...data,
        },
        {
          headers: {
            "x-api-key":
              "b2f9d58511806a5a142e99fe42c44c0eb91221d04227e28145e818a110c5e64f",
          },
        }
      ),
    onSuccess: (data, variables, context) => {
      handleSuccess(data);
    },
  });

export default useCreateIndex;
