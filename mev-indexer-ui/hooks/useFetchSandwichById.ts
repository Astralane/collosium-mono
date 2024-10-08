import { useQuery } from "@tanstack/react-query";
import { TSandwich } from "./useFetchSandwiches";

const useFetchSandwichById = (id: string) =>
  useQuery<string, unknown, TSandwich>({
    queryKey: ["sandwiches", id],
    queryFn: () => fetchSandwichById(id),
  });

const fetchSandwichById = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BE_URL}/mev/sandwich?tx_id=${id}`
  );
  return res.json();
};

export default useFetchSandwichById;
