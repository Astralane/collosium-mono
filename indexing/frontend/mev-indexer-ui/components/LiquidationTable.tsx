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
} from "@/hooks/useFetchLiquidationCounts";
import { useRouter } from "next/navigation";
import { TTokenMetaDataHelius } from "@/types/tokenMetaType";
import { useCallback, useState } from "react";
import {
  fetchTokenMetaDataHelius,
  fetchTokenPricesBirdsEye,
  TTokenMetaDataBirdsEye,
  fetchTokenMetaData,
} from "@/utils/fetchTokenMetaData";
import Image from "next/image";
import { lamports, solImage } from "@/constants/common";
import Link from "next/link";
import axios from "axios";
import useFetchLiquidations, {
  TLiquidations,
} from "@/hooks/useFetchLiquidations";

type TLiquidationTableProps = {
  totalCounts?: TotalCountsResult;
};

const LiquidationTable: React.FC<TLiquidationTableProps> = ({
  totalCounts,
}) => {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  const { data, isPending } = useFetchLiquidations(paginationModel.page);
  const columns: GridColDef<TLiquidations>[] = [
    {
      field: "block_slot",
      headerName: "Slot",
      width: 100,
    },
    {
      field: "block_time",
      headerName: "Date",
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.value * 1000);
        return <Box>{date.toLocaleString()}</Box>;
      },
      width: 200,
    },
    {
      field: "tx_id",
      headerName: "Tx ID",
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
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
    },
    {
      field: "signer",
      headerName: "Protocol",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          color={"#3EEBB0"}
          sx={{
            ":hover": {
              textDecoration: "underline",
            },
            cursor: "pointer",
          }}
        >
          Kamino Lend
        </Box>
      ),
    },
    {
      field: "borrow_mint",
      headerName: "Token Deposited",
      renderCell: (params) => <RenderToken {...params} />,
      width: 150,
    },
    {
      field: "deposit_mint",
      headerName: "Token Borrowed",
      renderCell: (params) => <RenderToken {...params} />,
      width: 150,
    },
    {
      field: "is_err",
      headerName: "Status",
      renderCell: (params) => {
        return (
          <Box display={"flex"} alignContent={"center"} height={"100%"}>
            <Box
              sx={{
                // px: "8px",
                // py: "2px",
                // borderRadius: "5px",
                // backgroundColor: params.value ? "#B3311F" : "#438b1d",
                color: params?.value ? "#B3311F" : "#438b1d",
              }}
              fontSize={14}
            >
              {params?.value ? "Failed" : "Success"}
            </Box>
          </Box>
        );
      },
    },
  ];

  const RenderToken = (
    params: GridRenderCellParams<
      TLiquidations,
      any,
      any,
      GridTreeNodeWithRender
    >
  ) => {
    const [token, setToken] = useState<TTokenMetaDataBirdsEye | null>(null);
    React.useEffect(() => {
      const fetchTokenMeta = async () => {
        const tokenMeta = await fetchTokenMetaData(params.value);
        setToken(tokenMeta);
      };
      fetchTokenMeta();
    }, [params.row, params.value]);
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="Token"
          src={token?.logoURI ?? "/images/solscan.png"}
          sx={{
            width: 24,
            height: 24,
            marginRight: 1,
          }}
        ></Avatar>
        <Box
          sx={{
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {token?.symbol}
        </Box>
      </Box>
    );
  };
  const handleRowClick = (params: GridRowParams<TLiquidations>) => {
    router.push(`/liquidations/${params.row.tx_id}`);
  };
  return (
    <Paper sx={{ width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[10]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{ border: 0 }}
        getRowId={(row) => row.tx_id}
        onRowClick={(params) => handleRowClick(params)}
        rowCount={totalCounts?.total ?? 0}
        loading={isPending}
        rowSelection={false}
        paginationMode="server"
      />
    </Paper>
  );
};

export default LiquidationTable;
