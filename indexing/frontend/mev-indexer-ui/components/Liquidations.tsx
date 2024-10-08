"use client";

import useFetchLiquidationCounts from "@/hooks/useFetchLiquidationCounts";
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import LiquidationSummaryCard from "./LiquidationSummary";
import LiquidationTable from "./LiquidationTable";

const Liquidations = () => {
  const { data, isPending } = useFetchLiquidationCounts();
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          gap: "20px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isPending && <CircularProgress />}
        {!isPending && (
          <>
            {/* <LiquidationSummaryCard data={data} /> */}
            <Box width={"100%"}>
              <Typography variant="h5">Liquidations</Typography>
              <LiquidationTable totalCounts={data} />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default Liquidations;
