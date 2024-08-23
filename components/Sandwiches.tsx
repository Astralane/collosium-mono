"use client";
import { useEffect, useState } from "react";

import { Box, Button } from "@mui/material";
import { getMockData, useFetchSlots } from "@/utils/fetchSwaps";
import { MergedTx } from "@/types/parsedType";
import { RefreshRounded } from "@mui/icons-material";
import { ItemCard } from "./ItemCard";

const Sandwiches = () => {
  const [data, setData] = useState<MergedTx[] | []>([]);
  const formatedData = useFetchSlots();

  console.log(formatedData, "formatedData");
  //   useRaydiumSwapListener((logs) => {
  //     console.log(logs, "from radiyum");
  //   });

  // //useFetchSlots();
  // useEffect(() => {
  //   getMockData();
  // }, []);
  useEffect(() => {
    const data = getMockData();
    setData(data);
  }, []);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          maxWidth: 800,
        }}
      >
        <Button
          variant="text"
          sx={{
            color: "white",
          }}
        >
          <RefreshRounded /> Refresh
        </Button>
      </Box>
      {data.map((item) => {
        return <ItemCard item={item} key={item.front_run} />;
      })}
    </Box>
  );
};

export default Sandwiches;
