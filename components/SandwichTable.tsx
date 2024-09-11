import * as React from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
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
import { fetchTokenMetaDataHelius } from "@/utils/fetchTokenMetaData";
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
  const [prices, setPrices] = React.useState<TTokenPrice>();
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

  const fetchTokenMetaData = useCallback(async () => {
    setIsLoadingMetaData(true);
    const tokenMetaData = await fetchTokenMetaDataHelius(mergedTokens);
    setTokenMetaData(tokenMetaData);
    setIsLoadingMetaData(false);
  }, [mergedTokens]);
  const fetchTokenPrices = useCallback(async () => {
    const data = await axios.get(
      `https://api-v3.raydium.io/mint/price?mints=${mergedTokens.join(
        ","
      )},So11111111111111111111111111111111111111112`
    );
    const res = await data.data;
    if (res?.success) {
      setPrices(res.data);
    }
  }, [mergedTokens]);
  React.useEffect(() => {
    if (mergedTokens.length > 0) {
      fetchTokenMetaData();
      fetchTokenPrices();
    }
  }, [mergedTokens]);

  const columns: GridColDef<TSandwich>[] = [
    {
      field: "victim_swaps.block_date",
      headerName: "Date",
      renderCell: (params) => (
        <Box>{params.row["victim_swaps.block_date"][0]}</Box>
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
      renderCell: (params) => {
        // const
        const amountDiff =
          params.row["frontrun_swaps.amount_in"][0] -
            params.row["backrun_swaps.amount_out"][0] ===
          0
            ? params.row["frontrun_swaps.amount_out"][0] -
              params.row["backrun_swaps.amount_in"][0]
            : 0;
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
        const feeValuInsol = (txFees + priorityFee) / lamports;
        const solValueInUsd = prices
          ? (parseFloat(
              prices["So11111111111111111111111111111111111111112"] ?? "0.0"
            ) as unknown as number) * feeValuInsol
          : 0;
        const tokenValue = prices
          ? ((amountDiff *
              parseFloat(
                prices[params.row["frontrun_swaps.token_in"][0]] ?? "0"
              )) as unknown as number)
          : 0;
        const profit = tokenValue - solValueInUsd;
        console.log("startedHEre", {
          amountDiff,
          txFees,
          priorityFee,
          feeValuInsol,
          solValueInUsd,
          tokenValue,
          profit,
          actualTokenIn: params.row["frontrun_swaps.amount_in"][0],
          actualTokenOut: params.row["backrun_swaps.amount_out"][0],
        });
        return (
          <Box>
            $
            {profit > 0
              ? new Intl.NumberFormat("en-IN", {
                  maximumSignificantDigits: 3,
                }).format(profit)
              : 0}
          </Box>
        );
      },
    },
    {
      field: "victim_swaps.token_in",
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
  return (
    <Paper sx={{ width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[10]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{ border: 0 }}
        getRowId={(row) => row.frontrun_tx_id}
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
