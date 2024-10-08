"use client";
import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useFetchSandwiches, { TSandwich } from "@/hooks/useFetchSandwiches";
import { Avatar, AvatarGroup, Box } from "@mui/material";
import { formatText } from "@/utils/formatText";
import useFetchTotalCounts, {
  TotalCountsResult,
} from "@/hooks/useFetchTotalCounts";
import { useRouter } from "next/navigation";
import { TTokenMetaDataHelius } from "@/types/tokenMetaType";
import { useCallback, useState } from "react";
import {
  fetchTokenMetaDataHelius,
  fetchTokenPricesBirdsEye,
} from "@/utils/fetchTokenMetaData";
import Image from "next/image";
import { lamports, solImage } from "@/constants/common";
import Link from "next/link";
import axios from "axios";

type TSandwichTableProps = {
  totalCounts?: TotalCountsResult;
};
type TTokenPrice = {
  [key: string]: string | null;
};
const options = {
  method: "GET",
  headers: { "X-API-KEY": "982828a2846146b888f507653bd4718d" },
};
const SandwichTable: React.FC<TSandwichTableProps> = ({ totalCounts }) => {
  const router = useRouter();
  const [tokenMetaData, setTokenMetaData] = React.useState<
    TTokenMetaDataHelius[] | []
  >();
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  //const [prices, setPrices] = React.useState<TTokenPrice>();
  const { data, isPending } = useFetchSandwiches(paginationModel.page);
  const handleRwClick = (params: GridRowParams<TSandwich>) => {
    router.push(`/sandwich/${params.row.frontrun_tx_id}`);
  };
  const mergedTokens = React.useMemo(() => {
    const nonDup = new Set<string>();
    const merged =
      data?.map((sandwich) => {
        return [
          ...(sandwich?.["frontrun_swaps.token_in"] ?? []),
          ...(sandwich?.["backrun_swaps.token_in"] ?? []),
          ...(sandwich?.["victim_swaps.token_in"] ?? []),
          ...(sandwich?.["frontrun_swaps.token_out"] ?? []),
          ...(sandwich?.["backrun_swaps.token_out"] ?? []),
          ...(sandwich?.["victim_swaps.token_out"] ?? []),
        ];
      }) ?? [];
    const finalMerge = merged.flat();
    return finalMerge.filter((item) => {
      if (nonDup.has(item)) return false;
      nonDup.add(item);
      return true;
    });
  }, [data]);

  // const mergedTokenValues = React.useMemo(() => {
  //   const merged =
  //     data?.map((sandwich) => {
  //       const nonDup = new Set<string>();
  //       const tokens = [
  //         ...(sandwich?.["frontrun_swaps.token_in"] ?? []),
  //         ...(sandwich?.["backrun_swaps.token_in"] ?? []),
  //         ...(sandwich?.["victim_swaps.token_in"] ?? []),
  //         ...(sandwich?.["frontrun_swaps.token_out"] ?? []),
  //         ...(sandwich?.["backrun_swaps.token_out"] ?? []),
  //         ...(sandwich?.["victim_swaps.token_out"] ?? []),
  //       ];
  //       const finalMerged = tokens.flat();
  //       const finalTokens = finalMerged.filter((item) => {
  //         if (nonDup.has(item)) return false;
  //         nonDup.add(item);
  //         return true;
  //       });
  //       const date = new Date(sandwich["frontrun_swaps.block_date"][0]); // Example date
  //       const unixTimestamp = Math.floor(date.getTime() / 1000);
  //       return {
  //         timeStamp: unixTimestamp,
  //         tokens: finalTokens,
  //       };
  //     }) ?? [];
  //   return merged;
  // }, [data]);

  const fetchTokenMetaData = useCallback(async () => {
    setIsLoadingMetaData(true);
    const tokenMetaData = await fetchTokenMetaDataHelius(mergedTokens);
    setTokenMetaData(tokenMetaData);
    setIsLoadingMetaData(false);
  }, [mergedTokens]);
  // const fetchTokenPrices = useCallback(async () => {
  //   const data = await axios.get(
  //     `https://api-v3.raydium.io/mint/price?mints=${mergedTokens.join(
  //       ","
  //     )},So11111111111111111111111111111111111111112`
  //   );
  //   const res = await data.data;
  //   if (res?.success) {
  //     setPrices(res.data);
  //   }
  // }, [mergedTokens]);
  React.useEffect(() => {
    // if (mergedTokenValues) {
    //   console.log("mergedTokenValues", mergedTokenValues);
    // }
    if (mergedTokens.length > 0) {
      //fetchTokenPricesBirdsEye(mergedTokens,mergedTokenValues);
      fetchTokenMetaData();
      //fetchTokenPrices();
    }
  }, [mergedTokens]);

  const columns: GridColDef<TSandwich>[] = [
    {
      field: "frontrun_swaps.block_date",
      headerName: "Date",
      renderCell: (params) => (
        <Box>{params.row["frontrun_swaps.block_date"][0]}</Box>
      ),
      width: 100,
    },
    { field: "slot", headerName: "Slot", width: 100 },
    {
      field: "frontrun_tx_id",
      headerName: "ID",
      renderCell: (params) => (
        <Box
          color={"#3EEBB0"}
          sx={{
            ":hover": {
              textDecoration: "underline",
            },
            cursor: "pointer",
          }}
        >
          {formatText(params.value)}
        </Box>
      ),
      width: 250,
    },
    {
      field: "backrun_swaps.amount_in",
      headerName: "Profit",
      width: 300,
      renderCell: (params) => <RenderProfit {...params} />,
    },

    {
      field: "frontrun_swaps.token_in",
      headerName: "Tokens",
      width: 500,
      renderCell: (params) => {
        const nonDup = new Set<string>();
        const mergedTokens = [
          ...(params.row["frontrun_swaps.token_in"] ?? []),
          ...(params.row["backrun_swaps.token_in"] ?? []),
          ...(params.row["victim_swaps.token_in"] ?? []),
          ...(params.row["frontrun_swaps.token_out"] ?? []),
          ...(params.row["backrun_swaps.token_out"] ?? []),
          ...(params.row["victim_swaps.token_out"] ?? []),
        ];
        const final = mergedTokens.filter((item) => {
          if (nonDup.has(item)) return false;
          nonDup.add(item);
          return true;
        });
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              height: "100%",
            }}
          >
            {" "}
            <AvatarGroup max={20}>
              {final.map((token) => {
                // if (
                //   tokenMetaData?.find((item) => item.account === token)
                //     ?.offChainMetadata?.metadata?.image === undefined
                // ) {
                //   return (
                //     <Link href={`https://solscan.io/account/${token}`}>
                //       <Image
                //         key={token}
                //         src={"/images/solscan.png"}
                //         alt={"img"}
                //         width={18}
                //         height={18}
                //         style={{ borderRadius: "50%" }}
                //         // placeholder="blur"
                //         // blurDataURL={solImage}
                //       />
                //     </Link>
                //   );
                // }
                return (
                  <Avatar
                    alt="Token"
                    key={token}
                    src={
                      tokenMetaData?.find((item) => item.account === token)
                        ?.offChainMetadata?.metadata?.image ??
                      tokenMetaData?.find((item) => item.account === token)
                        ?.legacyMetadata?.logoURI ??
                      "/images/solscan.png"
                    }
                    sx={{
                      width: 18,
                      height: 18,
                    }}
                  />

                  // <Link href={`https://solscan.io/account/${token}`}>
                  //   <Image
                  //     key={token}
                  //     src={
                  //       tokenMetaData?.find((item) => item.account === token)
                  //         ?.offChainMetadata?.metadata?.image ??
                  //       tokenMetaData?.find((item) => item.account === token)
                  //         ?.legacyMetadata?.logoURI ??
                  //       "/images/solscan.png"
                  //     }
                  //     // onError={(
                  //     //   e: React.SyntheticEvent<HTMLImageElement, Event>
                  //     // ) => {
                  //     //   e.currentTarget.src = "/images/solscan.png";
                  //     // }}
                  //     alt="img"
                  //     width={18}
                  //     height={18}
                  //     style={{ borderRadius: "50%" }}
                  //     // placeholder="blur"
                  //     // blurDataURL={solImage}
                  //   />
                  // </Link>
                );
              })}
            </AvatarGroup>
            {/* <Box
              sx={{
                backgroundColor: "gray",
                color: "white",
                borderRadius: "50%",
                fontSize: "8px",
                width: "16px",
                height: "16px",
              }}
            >
              1
            </Box> */}
          </Box>
        );
      },
    },
  ];

  const RenderProfit = (
    params: GridRenderCellParams<TSandwich, any, any, GridTreeNodeWithRender>
  ) => {
    const [profit, setProfit] = useState<number | null>(null); // For fetched profit
    const amountDiff =
      params.row["backrun_swaps.amount_in"][0] -
      params.row["frontrun_swaps.amount_out"][0];

    const txFees =
      params.row["backrun_swaps.tx_fee"].reduce(
        (acc: number, curr: number | string) =>
          acc + (typeof curr === "string" ? parseFloat(curr) : curr),
        0
      ) ?? 0;
    const priorityFee =
      params.row["backrun_swaps.priority_fee"].reduce(
        (acc: number, curr: number | string) =>
          acc + (typeof curr === "string" ? parseFloat(curr) : curr),
        0
      ) ?? 0;
    const feeValuInsol = (txFees + priorityFee) / 1000000000; // lamports to SOL
    const timeStamp = new Date(params.row["frontrun_swaps.block_date"][0]);
    const unixTimestamp = Math.floor(timeStamp.getTime() / 1000);

    React.useEffect(() => {
      // Async fetch token prices
      const fetchPrices = async () => {
        try {
          const solPrice = await fetchTokenPricesBirdsEye(
            "So11111111111111111111111111111111111111112",
            unixTimestamp
          );
          // const tokenInPrice = await fetchTokenPricesBirdsEye(
          //   params.row["frontrun_swaps.token_out"][0],
          //   unixTimestamp
          // );
          const tokenOutPrice = await fetchTokenPricesBirdsEye(
            params.row["backrun_swaps.token_in"][0],
            unixTimestamp
          );

          const solValueInUsd = solPrice ? solPrice * feeValuInsol : 0;
          const tokenValue = tokenOutPrice ? amountDiff * tokenOutPrice : 0;
          const calculatedProfit = tokenValue - solValueInUsd;
          // console.log({
          //   profit: calculatedProfit,
          //   solPrice,
          //   tokenOutPrice: tokenOutPrice,
          //   tokenOut: params.row["backrun_swaps.token_in"][0],
          //   id: params.row.frontrun_tx_id,
          //   bId: params.row.backrun_tx_id,
          //   frontTokenIn: params.row["frontrun_swaps.token_in"][0],
          //   frontOut: params.row["frontrun_swaps.token_out"][0],
          //   backrunTokenIn: params.row["backrun_swaps.token_in"][0],
          //   backrunOut: params.row["backrun_swaps.token_out"][0],
          // });
          setProfit(Math.abs(calculatedProfit)); // Set the fetched profit
        } catch (error) {
          console.error("Error fetching prices", error);
        }
      };

      fetchPrices();
    }, [params.row, amountDiff, feeValuInsol, unixTimestamp]);

    // Display loading while fetching profit
    return (
      <Box>
        {profit !== null
          ? `$${new Intl.NumberFormat("en-IN", {
              maximumSignificantDigits: 3,
            }).format(profit)}`
          : "Loading..."}
      </Box>
    );
  };
  return (
    <Paper>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[10]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{ border: 0 }}
        getRowId={(row) => row.frontrun_tx_id || `${row.slot}-${Math.random()}`}
        onRowClick={(params) => handleRwClick(params)}
        rowCount={totalCounts?.original_count}
        loading={isPending || isLoadingMetaData}
        rowSelection={false}
        paginationMode="server"
      />
    </Paper>
  );
};

export default SandwichTable;
