import React, { FC, useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import Image from "next/image";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Person2Outlined } from "@mui/icons-material";
import getTokenMetadata, {
  fetchTokenMetaDataHelius,
} from "@/utils/fetchTokenMetaData";
import { SolTokenMetadataJSON } from "moralis/common-sol-utils";

type SwapItemProps = {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  tokenInUrl: string;
  tokenOutUrl: string;
  tokeInAddress: string;
  tokenOutAddress: string;
  icon: any;
};
const SwapItem: FC<SwapItemProps> = ({
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  tokenInUrl,
  tokenOutUrl,
  icon,
  tokeInAddress,
  tokenOutAddress,
}) => {
  // const handleTokenMetaData = async (tokenIn: string, tokenOut: string) => {
  //   console.log(tokenIn, tokenOut);
  //   const tokenIndata = await getTokenMetadata(tokenIn);
  //   const tokenOutdata = await getTokenMetadata(tokenOut);
  //   setTokenInMeta(tokenIndata);
  //   setTokenOutMeta(tokenOutdata);
  //   const datas = await fetchTokenMetaDataHelius([tokenIn, tokenOut]);
  //   console.log(datas, "From heilus");
  // };

  // useEffect(() => {
  //   if (tokenIn && tokenOut) {
  //     handleTokenMetaData(tokenIn, tokenOut);
  //   }
  // }, [tokenIn, tokenOut]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "45%",
          }}
        >
          <Image
            alt="token1"
            height={30}
            width={30}
            src={tokenInUrl}
            style={{
              borderRadius: "50%",
            }}
          ></Image>
          <Box>
            <Link
              variant="body1"
              color={"text.secondary"}
              fontWeight={"600"}
              underline="none"
              href={`https://solscan.io/account/${tokeInAddress}`}
              target="_blank"
            >
              {tokenIn}
            </Link>
            <Typography variant="body1" fontWeight={"600"} mt="5px">
              {parseFloat(amountIn).toFixed(8)}
            </Typography>
          </Box>
        </Box>

        <Box width={"5%"}>
          {icon === "arrow" ? <ArrowRightAltIcon /> : <Person2Outlined />}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "45%",
            justifyContent: "flex-end",
          }}
        >
          <Box textAlign={"right"}>
            <Link
              variant="body1"
              color={"text.secondary"}
              fontWeight={"600"}
              underline="none"
              href={`https://solscan.io/account/${tokenOutAddress}`}
              target="_blank"
            >
              {tokenOut}
            </Link>
            <Typography variant="body1" fontWeight={"600"} mt="5px">
              {parseFloat(amountOut).toFixed(8)}
            </Typography>
          </Box>
          <Image
            alt="token1"
            height={30}
            width={30}
            src={tokenOutUrl}
            style={{
              borderRadius: "50%",
            }}
          ></Image>
        </Box>
      </Box>
    </>
  );
};

export default SwapItem;
