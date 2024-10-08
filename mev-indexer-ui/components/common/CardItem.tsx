import { Box, colors } from "@mui/material";
import Link from "next/link";
import React, { FC } from "react";

type CardItemProps = {
  title: string;
  value: any;
  textToEnd: boolean;
  isLink?: boolean;
  ogValue?: string;
  isAccount?: boolean;
};
const CardItem: FC<CardItemProps> = ({
  ogValue,
  title,
  value,
  textToEnd,
  isLink,
  isAccount,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box color={colors.grey[300]}>{title}</Box>
      {!isLink ? (
        <Box textAlign={textToEnd ? "right" : "left"} fontWeight={500}>
          {value}
        </Box>
      ) : (
        <Link
          href={`https://solscan.io/${isAccount ? "account" : "tx"}/${ogValue}`}
          target="_balnk"
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            color: "#3EEBB0",
          }}
        >
          {value}
        </Link>
      )}
    </Box>
  );
};

export default CardItem;
