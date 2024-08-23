import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { getMockData, useFetchSlots } from "@/utils/fetchSwaps";
import Link from "@mui/material/Link";
import { formatText } from "@/utils/formatText";
import SwapItem from "./SwapItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MergedTx } from "@/types/parsedType";
type TItemCard = {
  item: MergedTx;
};
export const ItemCard: FC<TItemCard> = ({ item }) => {
  const [victims, setVictims] = useState<string[]>(item.victims.slice(0, 5));
  const [showMore, setShowMore] = useState<boolean>(false);
  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    if (showMore) {
      setVictims(item.victims);
    } else {
      setVictims(item.victims.slice(0, 5));
    }
  }, [item.victims, showMore]);

  return (
    <Card sx={{ maxWidth: 800, width: "100%" }} key={item.front_run}>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: matches ? "row" : "column",
        }}
      >
        <Box
          width={matches ? "40%" : "100%"}
          textAlign={"center"}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box>
            <Typography variant="subtitle1">Slot</Typography>
            <Typography variant="body1" color={"#90CAF9"}>
              232309938
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1">Attacker</Typography>
            <Link
              href={`https://solscan.io/account/${item.attacker}`}
              underline="none"
              fontSize={"16px"}
              color={"#90CAF9"}
              textOverflow={"ellipsis"}
              target="_blank"
            >
              {formatText(item.attacker)}
            </Link>
          </Box>

          <Box>
            <Typography variant="subtitle1">Victims</Typography>
            {victims.map((victim) => (
              <Link
                href={`https://solscan.io/account/${item.victims}`}
                underline="none"
                fontSize={"16px"}
                color={"#90CAF9"}
                display={"block"}
                target="_blank"
                key={victim}
              >
                {formatText(victim)}
              </Link>
            ))}
            {item.victims.length > 5 && !showMore && (
              <Box
                sx={{
                  cursor: "pointer",
                  color: "#90CAF9",
                }}
                onClick={() => setShowMore(true)}
              >
                Show more
              </Box>
            )}
            {item.victims.length > 5 && showMore && (
              <Box
                sx={{
                  cursor: "pointer",
                  color: "#90CAF9",
                }}
                onClick={() => setShowMore(false)}
              >
                Show less
              </Box>
            )}
          </Box>
        </Box>
        <Divider
          orientation={matches ? "vertical" : "horizontal"}
          variant={matches ? "middle" : "fullWidth"}
          flexItem
          sx={{
            width: matches ? 2 : "100%",
            backgroundColor: "gray",
            borderRadius: "10px",
            marginTop: matches ? 0 : "20px",
          }}
        />
        <Box
          width={matches ? "60%" : "100%"}
          marginLeft={matches ? "20px" : 0}
          marginTop={matches ? 0 : "20px"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Typography
            fontSize={"14px"}
            color={"text.secondary"}
            fontWeight={600}
            component={"div"}
            mt={`5px`}
          >
            Frontrun
          </Typography>
          <SwapItem
            tokenIn={item.frontRunData.data.tokens_swapped?.in?.name ?? ""}
            tokenOut={item.frontRunData.data.tokens_swapped?.out?.name ?? ""}
            amountIn={item.frontRunData.data.tokens_swapped?.in?.amount ?? ""}
            amountOut={item.frontRunData.data.tokens_swapped?.out?.amount ?? ""}
            tokenInUrl={
              item.frontRunData.data.tokens_swapped?.in?.image_uri ?? ""
            }
            tokenOutUrl={
              item.frontRunData.data.tokens_swapped?.out?.image_uri ?? ""
            }
            icon={"arrow"}
            tokeInAddress={
              item.frontRunData.data.tokens_swapped?.in?.token_address ?? ""
            }
            tokenOutAddress={
              item.frontRunData.data.tokens_swapped?.out?.token_address ?? ""
            }
          />
          <Typography
            fontSize={"14px"}
            color={"text.secondary"}
            fontWeight={600}
            component={"div"}
            mt={`5px`}
          >
            Backrun
          </Typography>
          <SwapItem
            tokenIn={item.backRunData.data.tokens_swapped?.in?.name ?? ""}
            tokenOut={item.backRunData.data.tokens_swapped?.out?.name ?? ""}
            amountIn={item.backRunData.data.tokens_swapped?.in?.amount ?? ""}
            amountOut={item.backRunData.data.tokens_swapped?.out?.amount ?? ""}
            tokenInUrl={
              item.backRunData.data.tokens_swapped?.in?.image_uri ?? ""
            }
            tokenOutUrl={
              item.backRunData.data.tokens_swapped?.out?.image_uri ?? ""
            }
            icon={"arrow"}
            tokeInAddress={
              item.backRunData.data.tokens_swapped?.in?.token_address ?? ""
            }
            tokenOutAddress={
              item.backRunData.data.tokens_swapped?.out?.token_address ?? ""
            }
          />
        </Box>
      </CardContent>
    </Card>
  );
};
