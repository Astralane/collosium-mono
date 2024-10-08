"use client";

import { Box, CircularProgress, Tabs, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import React from "react";
import TabLayout from "@/components/TabLayout";
import SummaryCard from "@/components/SummaryCard";
import useFetchTotalCounts from "@/hooks/useFetchTotalCounts";
export default function Home() {
  const { data, isPending } = useFetchTotalCounts();
  return (
    <Box
      sx={{
        marginTop: "30px",
        padding: "20px",
        //width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      {isPending && <CircularProgress />}
      <Box>
        <Typography variant="h4" textAlign={"center"} mb={"20px"}>
          Astralane Solana MEV Dashboard
        </Typography>

        <SummaryCard data={data} />
        <TabLayout />
      </Box>
    </Box>
  );
}
