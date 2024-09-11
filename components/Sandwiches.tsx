"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

import SummaryCard from "./SummaryCard";
import SandwichTable from "./SandwichTable";
import useFetchTotalCounts from "@/hooks/useFetchTotalCounts";

const Sandwiches = () => {
  const { data, isPending } = useFetchTotalCounts();
  return (
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
          <SummaryCard data={data} />
          <Box width={"100%"} maxWidth={1200}>
            <Typography variant="h5">Attacks</Typography>
            <SandwichTable totalCounts={data} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Sandwiches;
