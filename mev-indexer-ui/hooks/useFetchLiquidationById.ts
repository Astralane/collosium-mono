import { useQuery } from "@tanstack/react-query";
import { TLiquidations } from "./useFetchLiquidations";

const useFetchLiquidationById = (id: string) =>
  useQuery<string, unknown, TLiquidations>({
    queryKey: ["sandwiches", id],
    queryFn: () => fetchLiquidationhById(id),
  });

const fetchLiquidationhById = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BE_URL}/mev/liquidation?tx_id=${id}`
  );
  return res.json();
};

export default useFetchLiquidationById;
