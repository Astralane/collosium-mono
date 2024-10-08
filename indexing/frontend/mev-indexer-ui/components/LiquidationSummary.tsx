"use client";
import { TotalCountsResult } from "@/hooks/useFetchLiquidationCounts";
import { Box, Card, CardContent, colors, Typography } from "@mui/material";
import React, { FC } from "react";
type TLiquidationSummaryCardProps = {
  data?: TotalCountsResult;
};
const LiquidationSummaryCard: FC<TLiquidationSummaryCardProps> = ({ data }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" mb={"10px"}>
        Summary
      </Typography>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: "20px",
            }}
          >
            {/* box-1 */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box color={colors.grey[500]}>Total tx</Box>
                <Box color={colors.grey[300]}>{data?.total ?? 0}</Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box color={colors.grey[500]}>Total liquidators</Box>
                <Box color={colors.grey[300]}>{data?.total_signers ?? 0}</Box>
              </Box>
            </Box>

            {/* box-2 */}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LiquidationSummaryCard;
