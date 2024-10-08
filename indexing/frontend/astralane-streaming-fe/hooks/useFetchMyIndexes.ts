import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchMyIndexes = () => {
  return useQuery<unknown, unknown, Indexes[]>({
    queryKey: ["Indexes"],
    queryFn: () => fetchIndexes(),
  });
};

const fetchIndexes = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_STREAMING_SERVER}/index`,
    {
      headers: {
        "x-api-key":
          "b2f9d58511806a5a142e99fe42c44c0eb91221d04227e28145e818a110c5e64f",
      },
    }
  );
  return response.data;
};

export default useFetchMyIndexes;

type Indexes = {
  name: string;
  index_id: string;
};
