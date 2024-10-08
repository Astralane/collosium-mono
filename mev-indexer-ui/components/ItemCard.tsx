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
import getTokenMetadata from "@/utils/fetchTokenMetaData";
import { TTokenMetaDataHelius } from "@/types/tokenMetaType";
import { solImage } from "@/constants/common";
type TItemCard = {
  id: string;
  front_run: {
    token_in: string;
    token_out: string;
    amount_in: number;
    amount_out: number;
  };
  back_run: {
    token_in: string;
    token_out: string;
    amount_in: number;
    amount_out: number;
  };
  victims: TVictims[];
  metadata?: TTokenMetaDataHelius[];
};

type TVictims = {
  token_in: string;
  token_out: string;
  amount_in: number;
  amount_out: number;
};

export const ItemCard: FC<TItemCard> = ({
  id,
  front_run,
  back_run,
  victims,
  metadata,
}) => {
  const [victimsData, setVictimsData] = useState<TVictims[]>(
    victims.slice(0, 5)
  );
  const [showMore, setShowMore] = useState<boolean>(false);
  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    if (showMore) {
      setVictimsData(victims);
    } else {
      setVictimsData(victims.slice(0, 5));
    }
  }, [victims, showMore]);
  // useEffect(() => {
  //   if (front_run.token_in && front_run.token_out) {
  //     getTokenData(front_run.token_in);
  //   }
  // }, [front_run.token_in, front_run.token_out]);
  // const getTokenData = async (token: string) => {
  //   const data = await getTokenMetadata(token);
  //   console.log(data, "from roken");
  // };
  return (
    <Box sx={{ maxWidth: 800, width: "100%" }} key={id}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: matches ? "row" : "column",
        }}
      >
        {/* <Box
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
        /> */}
        <Box
          width={"100%"}
          marginTop={matches ? 0 : "20px"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {" "}
          <Typography
            fontSize={"18px"}
            color={"white"}
            fontWeight={600}
            component={"div"}
            mb={`5px`}
          >
            Frontrun
          </Typography>
          <Card
            sx={{
              backgroundColor: "#2F264F",
            }}
          >
            <CardContent>
              <SwapItem
                tokenIn={
                  metadata?.find((item) => item.account === front_run.token_in)
                    ?.onChainMetadata?.metadata?.data?.symbol ?? ""
                }
                tokenOut={
                  metadata?.find((item) => item.account === front_run.token_out)
                    ?.onChainMetadata?.metadata?.data?.symbol ?? ""
                }
                amountIn={JSON.stringify(front_run.amount_in) ?? "0"}
                amountOut={JSON.stringify(front_run.amount_out) ?? "0"}
                tokenInUrl={
                  metadata?.find((item) => item.account === front_run.token_in)
                    ?.offChainMetadata?.metadata?.image ??
                  metadata?.find((item) => item.account === front_run.token_in)
                    ?.legacyMetadata?.logoURI ??
                  "/images/solscan.png"
                }
                tokenOutUrl={
                  metadata?.find((item) => item.account === front_run.token_out)
                    ?.offChainMetadata?.metadata?.image ??
                  metadata?.find((item) => item.account === front_run.token_out)
                    ?.legacyMetadata?.logoURI ??
                  "/images/solscan.png"
                }
                icon={"arrow"}
                tokeInAddress={formatText(front_run.token_out) ?? ""}
                tokenOutAddress={formatText(front_run.token_out) ?? ""}
              />
            </CardContent>
          </Card>
          <Divider orientation="horizontal"></Divider>
          <Box>
            <Typography
              fontSize={"18px"}
              color={"white"}
              fontWeight={600}
              component={"div"}
              mb={`10px`}
            >
              Victims token flow
            </Typography>
            <Typography
              fontSize={"18px"}
              color={"white"}
              fontWeight={600}
              component={"div"}
              mb={`10px`}
            >
              Total {victims.length} transactions
            </Typography>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    gap: "15px",
                    flexDirection: "column",
                  }}
                >
                  {victimsData.map((victim, index) => (
                    <SwapItem
                      key={index}
                      tokenIn={
                        metadata?.find(
                          (item) => item.account === victim.token_in
                        )?.onChainMetadata?.metadata?.data?.symbol ?? ""
                      }
                      tokenOut={
                        metadata?.find(
                          (item) => item.account === victim.token_out
                        )?.onChainMetadata?.metadata?.data?.symbol ?? ""
                      }
                      amountIn={JSON.stringify(victim.amount_in) ?? "0"}
                      amountOut={JSON.stringify(victim.amount_out) ?? "0"}
                      tokenInUrl={
                        metadata?.find(
                          (item) => item.account === victim.token_in
                        )?.offChainMetadata?.metadata?.image ??
                        metadata?.find(
                          (item) => item.account === victim.token_in
                        )?.legacyMetadata?.logoURI ??
                        "/images/solscan.png"
                      }
                      tokenOutUrl={
                        metadata?.find(
                          (item) => item.account === victim.token_out
                        )?.offChainMetadata?.metadata?.image ??
                        metadata?.find(
                          (item) => item.account === victim.token_out
                        )?.legacyMetadata?.logoURI ??
                        "/images/solscan.png"
                      }
                      icon={"arrow"}
                      tokeInAddress={formatText(victim.token_in) ?? ""}
                      tokenOutAddress={formatText(victim.token_out) ?? ""}
                    />
                  ))}
                </Box>
                {victims.length > 5 && !showMore && (
                  <Box
                    sx={{
                      cursor: "pointer",
                      color: "#90CAF9",
                      textAlign: "center",
                    }}
                    onClick={() => setShowMore(true)}
                  >
                    Show more
                  </Box>
                )}
                {victims.length > 5 && showMore && (
                  <Box
                    sx={{
                      cursor: "pointer",
                      color: "#90CAF9",
                      textAlign: "center",
                    }}
                    onClick={() => setShowMore(false)}
                  >
                    Show less
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
          <Divider orientation="horizontal"></Divider>
          <Typography
            fontSize={"18px"}
            color={"white"}
            fontWeight={600}
            component={"div"}
            mb={`5px`}
          >
            Backrun
          </Typography>
          <Card
            sx={{
              backgroundColor: "#3A2434",
            }}
          >
            <CardContent>
              <SwapItem
                tokenIn={
                  metadata?.find((item) => item.account === back_run.token_in)
                    ?.onChainMetadata?.metadata?.data?.symbol ?? ""
                }
                tokenOut={
                  metadata?.find((item) => item.account === back_run.token_out)
                    ?.onChainMetadata?.metadata?.data?.symbol ?? ""
                }
                amountIn={JSON.stringify(back_run.amount_in) ?? "0"}
                amountOut={JSON.stringify(back_run.amount_out) ?? "0"}
                tokenInUrl={
                  metadata?.find((item) => item.account === back_run.token_in)
                    ?.offChainMetadata?.metadata?.image ??
                  metadata?.find((item) => item.account === back_run.token_in)
                    ?.legacyMetadata?.logoURI ??
                  "/images/solscan.png"
                }
                tokenOutUrl={
                  metadata?.find((item) => item.account === back_run.token_out)
                    ?.offChainMetadata?.metadata?.image ??
                  metadata?.find((item) => item.account === back_run.token_out)
                    ?.legacyMetadata?.logoURI ??
                  "/images/solscan.png"
                }
                icon={"arrow"}
                tokeInAddress={formatText(back_run.token_in) ?? ""}
                tokenOutAddress={formatText(back_run.token_out) ?? ""}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
