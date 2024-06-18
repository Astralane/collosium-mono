import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

const useCreateIndex = (handleSuccess: (data: any) => void) =>
  useMutation({
    mutationFn: (data: any) =>
      axios.post(`${process.env.NEXT_PUBLIC_STREAMING_SERVER}/index`, {
        ...data,
      }),
    onSuccess: (data, variables, context) => {
      handleSuccess(data);
    },
  });

export default useCreateIndex;
