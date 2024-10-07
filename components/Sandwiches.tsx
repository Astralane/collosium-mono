"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

import SummaryCard from "./SummaryCard";
import SandwichTable from "./SandwichTable";
import useFetchTotalCounts from "@/hooks/useFetchTotalCounts";
import React from "react";

const Sandwiches = () => {
  const { data, isPending } = useFetchTotalCounts();
  return (
    <Box
      sx={
        {
          // display: "flex",
          // width: "100%",
          // gap: "20px",
          // flexDirection: "column",
          // alignItems: "center",
        }
      }
    >
      {!isPending && (
        <>
          <Box>
            <Typography variant="h5">Attacks</Typography>
            <SandwichTable totalCounts={data} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Sandwiches;
