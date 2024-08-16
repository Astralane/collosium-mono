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
        "x-api-key": "myKe23y",
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
