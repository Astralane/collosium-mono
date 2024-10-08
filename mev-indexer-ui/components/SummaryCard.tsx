"use client";
import useFetchLiquidationCounts from "@/hooks/useFetchLiquidationCounts";
import { TotalCountsResult } from "@/hooks/useFetchTotalCounts";
import { Box, Card, CardContent, colors, Typography } from "@mui/material";
import React, { FC } from "react";
type TSummaryCardProps = {
  data?: TotalCountsResult;
};
const SummaryCard: FC<TSummaryCardProps> = ({ data }) => {
  const { data: liquidationData, isPending } = useFetchLiquidationCounts();

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
              flexDirection: "column",
            }}
          >
            {/* box-1 */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "50%",
                }}
              >
                <Box color={colors.grey[500]}>Total tx</Box>
                <Box color={colors.grey[300]}>{data?.original_count ?? 0}</Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "50%",
                }}
              >
                <Box color={colors.grey[500]}>Total profit</Box>
                <Box color={colors.grey[300]}>$23,342</Box>
              </Box>
            </Box>

            {/* box-2 */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "50%",
                }}
              >
                <Box color={colors.grey[500]}>Total attackers</Box>
                <Box color={colors.grey[300]}>{data?.total_victims}</Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "50%",
                }}
              >
                <Box color={colors.grey[500]}>Total victims</Box>
                <Box color={colors.grey[300]}>{data?.total_attackers}</Box>
              </Box>
            </Box>

            {/* box-3 */}
            <Box
              sx={{
                // width: "50%",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "50%",
                }}
              >
                <Box color={colors.grey[500]}>Total liquidations</Box>
                <Box color={colors.grey[300]}>{liquidationData?.total}</Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "50%",
                }}
              >
                <Box color={colors.grey[500]}>Total liquidators</Box>
                <Box color={colors.grey[300]}>
                  {liquidationData?.total_signers}
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SummaryCard;
