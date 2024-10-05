"use client";
import Liquidations from "@/components/Liquidations";

import { Box, Tabs, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import React from "react";

export default function LiquidationPage() {
  return (
    <Box
      sx={{
        marginTop: "30px",
        padding: "20px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h4" textAlign={"center"} mb={"20px"}>
          Astralane Solana Liquidation Monitor
        </Typography>
      </Box>
    </Box>
  );
}
