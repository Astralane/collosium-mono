"use client";
import CardItem from "@/components/common/CardItem";
import { ItemCard } from "@/components/ItemCard";
import Sandwiches from "@/components/Sandwiches";
import { lamports } from "@/constants/common";
import useFetchSandwichById from "@/hooks/useFetchSandwichById";
import { TSandwich, TVictim } from "@/hooks/useFetchSandwiches";
import { MergedTx } from "@/types/parsedType";
import { TTokenMetaDataHelius } from "@/types/tokenMetaType";
import { getMockData } from "@/utils/fetchSwaps";
import { fetchTokenMetaDataHelius } from "@/utils/fetchTokenMetaData";
import { formatText } from "@/utils/formatText";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  colors,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Sandwich({ params }: { params: { id: string } }) {
  const [tokenMetaData, setTokenMetaData] = useState<
    TTokenMetaDataHelius[] | []
  >();
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);
  const { data, isPending } = useFetchSandwichById(params.id);
  const victimPriorityFee = useMemo(
    () =>
      data?.["victim_swaps.priority_fee"].reduce(
        (acc: number, curr: number | string) =>
          acc + (typeof curr === "string" ? parseFloat(curr) : curr),
        0
      ) ?? 0,
    [data?.["victim_swaps.priority_fee"]]
  );
  const frontRunPriorityFee = useMemo(
    () =>
      data?.["frontrun_swaps.priority_fee"].reduce(
        (acc: number, curr: number | string) =>
          acc + (typeof curr === "string" ? parseFloat(curr) : curr),
        0
      ) ?? 0,
    [data?.["frontrun_swaps.priority_fee"]]
  );
  const backRunPriorityFee = useMemo(
    () =>
      data?.["backrun_swaps.priority_fee"].reduce(
        (acc: number, curr: number | string) =>
          acc + (typeof curr === "string" ? parseFloat(curr) : curr),
        0
      ) ?? 0,
    [data?.["backrun_swaps.priority_fee"]]
  );
  const frontRunTxFee = useMemo(
    () =>
      data?.["frontrun_swaps.tx_fee"].reduce(
        (acc: number, curr: number | string) =>
          acc + (typeof curr === "string" ? parseFloat(curr) : curr),
        0
      ) ?? 0,
    [data?.["frontrun_swaps.tx_fee"]]
  );
  const backRunTxFee = useMemo(
    () =>
      data?.["backrun_swaps.tx_fee"].reduce(
        (acc: number, curr: number | string) =>
          acc + (typeof curr === "string" ? parseFloat(curr) : curr),
        0
      ) ?? 0,
    [data?.["backrun_swaps.tx_fee"]]
  );
  const victimTxFee = useMemo(
    () =>
      data?.["victim_swaps.tx_fee"].reduce(
        (acc: number, curr: number | string) =>
          acc + (typeof curr === "string" ? parseFloat(curr) : curr),
        0
      ) ?? 0,
    [data?.["victim_swaps.tx_fee"]]
  );
  const mergedPoolsAddresses = useMemo(() => {
    const nonDup = new Set<string>();
    const merged = [
      ...(data?.["frontrun_swaps.pool_address"] ?? []),
      ...(data?.["backrun_swaps.pool_address"] ?? []),
      ...(data?.["victim_swaps.pool_address"] ?? []),
    ];
    return merged.filter((item) => {
      if (nonDup.has(item)) return false;
      nonDup.add(item);
      return true;
    });
  }, [
    data?.["frontrun_swaps.pool_address"],
    data?.["backrun_swaps.pool_address"],
    data?.["victim_swaps.pool_address"],
  ]);
  const mergedTokens = useMemo(() => {
    const nonDup = new Set<string>();
    const merged = [
      ...(data?.["frontrun_swaps.token_in"] ?? []),
      ...(data?.["backrun_swaps.token_in"] ?? []),
      ...(data?.["victim_swaps.token_in"] ?? []),
      ...(data?.["frontrun_swaps.token_out"] ?? []),
      ...(data?.["backrun_swaps.token_out"] ?? []),
      ...(data?.["victim_swaps.token_out"] ?? []),
    ];
    return merged.filter((item) => {
      if (nonDup.has(item)) return false;
      nonDup.add(item);
      return true;
    });
  }, [
    data?.["frontrun_swaps.token_in"],
    data?.["backrun_swaps.token_in"],
    data?.["victim_swaps.token_in"],
    data?.["frontrun_swaps.token_out"],
    data?.["backrun_swaps.token_out"],
    data?.["victim_swaps.token_out"],
  ]);

  const fetchTokenMetaData = useCallback(async () => {
    setIsLoadingMetaData(true);
    const tokenMetaData = await fetchTokenMetaDataHelius(mergedTokens);
    setTokenMetaData(tokenMetaData);
    setIsLoadingMetaData(false);
  }, [mergedTokens]);

  useEffect(() => {
    if (mergedTokens.length > 0) {
      fetchTokenMetaData();
    }
  }, [mergedTokens]);

  const isLoading = isPending || isLoadingMetaData;

  return (
    <Box
      sx={{
        marginTop: "30px",
        padding: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ width: "100%", maxWidth: 800 }}>
          <Typography variant="h5" mb={2}>
            Sandwich transaction
          </Typography>
          <Card
            sx={{
              paddingRight: "10px",
              paddingLeft: "10px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <CardItem
                  title="Date"
                  value={data?.["frontrun_swaps.block_date"][0]}
                  textToEnd
                />
                <CardItem title="Slot" value={data?.slot} textToEnd />
                <CardItem
                  title="Frontrun"
                  textToEnd
                  value={formatText(data?.frontrun_tx_id ?? "")}
                  ogValue={data?.frontrun_tx_id ?? ""}
                  isLink
                />
                <CardItem
                  title="Backrun"
                  textToEnd
                  value={formatText(data?.backrun_tx_id ?? "")}
                  ogValue={data?.backrun_tx_id ?? ""}
                  isLink
                />
                <CardItem
                  title="No of victims"
                  textToEnd
                  value={data?.["victim_swaps.signer"].length}
                />
                <CardItem
                  title="Total priority fee"
                  textToEnd
                  value={`${
                    (victimPriorityFee +
                      backRunPriorityFee +
                      frontRunPriorityFee) /
                    lamports
                  } SOL`}
                />
                <CardItem
                  title="Total transaction fee"
                  textToEnd
                  value={`${
                    (victimTxFee + backRunTxFee + frontRunTxFee) / lamports
                  } SOL`}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box color={colors.grey[500]}>Pools interacted to</Box>

                  <Box
                    textAlign={"right"}
                    fontWeight={500}
                    display={"flex"}
                    //flexGrow={2}
                    width={"60%"}
                    gap={"5px"}
                    flexDirection={"row"}
                    flexWrap={"wrap"}
                    justifyContent={"flex-end"}
                  >
                    {/* {data?.["frontrun_swaps.pool_address"].map(
                    (item: string, index: number) => {
                      const isDup =
                        data?.["frontrun_swaps.pool_address"].indexOf(item) !==
                        index;
                      if (isDup) return null;
                      return (
                        <Link
                          href={`https://solscan.io/account/${item}`}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            marginRight: "3px",
                            color: "#3EEBB0",
                          }}
                        >
                          {formatText(item)}
                        </Link>
                      );
                    }
                  )} */}
                    {/* {data?.["backrun_swaps.pool_address"].map(
                    (item: string, index: number) => {
                      const isDup =
                        data?.["backrun_swaps.pool_address"].indexOf(item) !==
                        index;
                      if (isDup) return null;
                      return (
                        <Link
                          href={`https://solscan.io/account/${item}`}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            marginRight: "3px",
                            color: "#3EEBB0",
                          }}
                        >
                          {formatText(item)}
                        </Link>
                      );
                    }
                  )} */}
                    {mergedPoolsAddresses.map((item: string, index: number) => {
                      // const isDup =
                      //   data?.["victim_swaps.pool_address"].indexOf(item) !==
                      //   index;
                      // if (isDup) return null;
                      return (
                        <Link
                          key={index}
                          href={`https://solscan.io/account/${item}`}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            marginRight: "3px",
                            color: "#3EEBB0",
                          }}
                          target="_blank"
                        >
                          {formatText(item)}
                        </Link>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Typography variant="h6" mt={"20px"}>
            Token flow
          </Typography>
          <Box
            sx={{
              mt: "10px",
            }}
          >
            <ItemCard
              id={data?.frontrun_tx_id ?? "1"}
              front_run={{
                token_in: data?.["frontrun_swaps.token_in"][0] ?? "",
                token_out: data?.["frontrun_swaps.token_out"][0] ?? "",
                amount_in: data?.["frontrun_swaps.amount_in"][0] ?? 0,
                amount_out: data?.["frontrun_swaps.amount_out"][0] ?? 0,
              }}
              back_run={{
                token_in: data?.["backrun_swaps.token_in"][0] ?? "",
                token_out: data?.["backrun_swaps.token_out"][0] ?? "",
                amount_in: data?.["backrun_swaps.amount_in"][0] ?? 0,
                amount_out: data?.["backrun_swaps.amount_out"][0] ?? 0,
              }}
              victims={
                data?.["victim_swaps.signer"].map(
                  (item: string, index: number) => {
                    return {
                      token_in: data?.["victim_swaps.token_in"][index] ?? "",
                      token_out: data?.["victim_swaps.token_out"][index] ?? "",
                      amount_in: data?.["victim_swaps.amount_in"][index] ?? 0,
                      amount_out: data?.["victim_swaps.amount_out"][index] ?? 0,
                    };
                  }
                ) ?? []
              }
              metadata={tokenMetaData}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
