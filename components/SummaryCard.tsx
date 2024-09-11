"use client";
import useFetchTotalCounts, {
  TotalCountsResult,
} from "@/hooks/useFetchTotalCounts";
import { Box, Card, CardContent, colors, Typography } from "@mui/material";
import React, { FC } from "react";
type TSummaryCardProps = {
  data?: TotalCountsResult;
};
const SummaryCard: FC<TSummaryCardProps> = ({ data }) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 1200 }}>
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
                width: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                }}
              >
                <Box color={colors.grey[500]}>Total profit</Box>
                <Box color={colors.grey[300]}>$23,342</Box>
              </Box>
            </Box>

            {/* box-2 */}
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                }}
              >
                <Box color={colors.grey[500]}>Total victims</Box>
                <Box color={colors.grey[300]}>{data?.total_attackers}</Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SummaryCard;
