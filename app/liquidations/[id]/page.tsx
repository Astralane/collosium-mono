"use client";
import CardItem from "@/components/common/CardItem";
import { ItemCard } from "@/components/ItemCard";
import Sandwiches from "@/components/Sandwiches";
import SwapItem from "@/components/SwapItem";
import { lamports, wSol } from "@/constants/common";
import useFetchLiquidationById from "@/hooks/useFetchLiquidationById";
import useFetchSandwichById from "@/hooks/useFetchSandwichById";
import { TSandwich, TVictim } from "@/hooks/useFetchSandwiches";
import { MergedTx } from "@/types/parsedType";
import { TTokenMetaDataHelius } from "@/types/tokenMetaType";
import { getMockData } from "@/utils/fetchSwaps";
import {
  fetchTokenMetaData,
  fetchTokenMetaDataHelius,
  fetchTokenPricesBirdsEye,
  TTokenMetaDataBirdsEye,
} from "@/utils/fetchTokenMetaData";
import { formatText } from "@/utils/formatText";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  colors,
  Divider,
  Typography,
} from "@mui/material";
import { SolAddress } from "moralis/common-sol-utils";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Liquidation({ params }: { params: { id: string } }) {
  const { data, isPending } = useFetchLiquidationById(params.id);
  const [borrowToken, setBorrowToken] = useState<TTokenMetaDataBirdsEye | null>(
    null
  );
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [depositToken, setDepositToken] =
    useState<TTokenMetaDataBirdsEye | null>(null);
  useEffect(() => {
    async function fetchTokens() {
      setIsFetchingPrice(true);
      const borrowToken = await fetchTokenMetaData(data?.deposit_mint ?? "");
      const depositToken = await fetchTokenMetaData(data?.borrow_mint ?? "");
      // const date = new Date(data?.block_date * 1000);
      // const unixTim
      const solPrice = await fetchTokenPricesBirdsEye(
        wSol,
        data?.block_time ?? 0
      );
      setSolPrice(solPrice);
      setBorrowToken(borrowToken);
      setDepositToken(depositToken);
      setIsFetchingPrice(false);
    }
    if (data?.borrow_mint && data?.deposit_mint) {
      fetchTokens();
    }
  }, [data]);
  const depositTokenPrice = useMemo(() => {
    if (data && data.deposit_amount && data.deposit_value) {
      return (
        data?.deposit_value /
        (data?.deposit_amount / Math.pow(10, depositToken?.decimals ?? 1))
      );
    }
  }, [data, depositToken?.decimals]);
  const borrowTokenPrice = useMemo(() => {
    if (data && data.borrow_amount && data.borrow_value) {
      return (
        data?.borrow_value /
        (data?.borrow_amount / Math.pow(10, borrowToken?.decimals ?? 1))
      );
    }
  }, [data, borrowToken?.decimals]);
  const profit = useMemo(() => {
    if (depositTokenPrice && borrowTokenPrice && solPrice) {
      const withdrewValue =
        ((data?.withdrew as number) /
          Math.pow(10, depositToken?.decimals ?? 1)) *
        depositTokenPrice;
      const repaidValue =
        ((data?.liquidator_repaid as number) /
          Math.pow(10, borrowToken?.decimals ?? 1) +
          (data?.fees as number) / Math.pow(10, borrowToken?.decimals ?? 1)) *
        borrowTokenPrice;
      const txFees = ((data?.txn_fee as number) / lamports) * solPrice;
      //console.log(withdrewValue, repaidValue, txFees, "withdrewValue");
      return Math.abs(withdrewValue - repaidValue - txFees);
    }
  }, [
    borrowToken?.decimals,
    borrowTokenPrice,
    data?.fees,
    data?.liquidator_repaid,
    data?.txn_fee,
    data?.withdrew,
    depositToken?.decimals,
    depositTokenPrice,
    solPrice,
  ]);

  return (
    <Box
      sx={{
        marginTop: "30px",
        padding: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {isPending || isFetchingPrice ? (
        <CircularProgress />
      ) : (
        <Box sx={{ width: "100%", maxWidth: 800 }}>
          <Typography variant="h5" mb={2}>
            Liquidation transaction
          </Typography>
          <Card
            sx={{
              paddingRight: "10px",
              paddingLeft: "10px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <CardItem title="Slot" textToEnd value={data?.block_slot} />
                <CardItem title="Date" textToEnd value={data?.block_date} />
                <CardItem
                  title="Trasnaction ID"
                  textToEnd
                  value={formatText(data?.tx_id ?? "")}
                  ogValue={data?.tx_id ?? ""}
                  isLink
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box color={colors.grey[200]}>Status</Box>
                  <Box
                    sx={{
                      px: "8px",
                      py: "2px",
                      borderRadius: "5px",
                      backgroundColor: data?.is_err ? "#B3311F" : "#438b1d",
                      color: data?.is_err ? "white" : "white",
                    }}
                    fontSize={16}
                  >
                    {data?.is_err ? "FAILED" : "SUCCESS"}
                  </Box>
                </Box>
                <CardItem
                  title="Signer"
                  textToEnd
                  value={formatText(data?.signer ?? "")}
                  ogValue={data?.signer ?? ""}
                  isLink
                  isAccount
                />
                <CardItem
                  title="Program ID"
                  textToEnd
                  value={formatText(data?.outer_program ?? "")}
                  ogValue={data?.outer_program ?? ""}
                  isLink
                  isAccount
                />
                <CardItem
                  title="Program Name"
                  textToEnd
                  value={"Kamino Lend"}
                />
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box color={colors.grey[200]}>Deposit Token</Box>
                  <Box sx={{ display: "flex", gap: "5px" }} fontSize={16}>
                    <Box fontWeight={600}>{depositToken?.symbol}</Box>
                    <Avatar
                      src={depositToken?.logoURI ?? "/images/solscan.png"}
                      sx={{
                        width: 24,
                        height: 24,
                      }}
                    ></Avatar>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box color={colors.grey[200]}>Deposit Amount</Box>
                  <Box
                    sx={{ display: "flex", gap: "3px", fontWeight: 600 }}
                    fontSize={16}
                  >
                    <Box>
                      {data?.deposit_amount
                        ? (
                            data?.deposit_amount /
                            Math.pow(10, depositToken?.decimals ?? 1)
                          ).toFixed(2)
                        : 0}
                    </Box>
                    <Box fontWeight={500}>{depositToken?.symbol}</Box>
                  </Box>
                </Box>
                <CardItem
                  title="Deposit Value"
                  textToEnd
                  value={`$${data?.deposit_value}`}
                />
                <Divider />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box color={colors.grey[200]}>Borrow Token</Box>
                  <Box sx={{ display: "flex", gap: "5px" }} fontSize={16}>
                    <Box fontWeight={600}>{borrowToken?.symbol}</Box>
                    <Avatar
                      src={borrowToken?.logoURI ?? "/images/solscan.png"}
                      sx={{
                        width: 24,
                        height: 24,
                      }}
                    ></Avatar>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box color={colors.grey[200]}>Borrow Amount</Box>
                  <Box
                    sx={{ display: "flex", gap: "3px", fontWeight: 600 }}
                    fontSize={16}
                  >
                    <Box>
                      {data?.borrow_amount
                        ? (
                            data?.borrow_amount /
                            Math.pow(10, borrowToken?.decimals ?? 1)
                          ).toFixed(2)
                        : 0}
                    </Box>
                    <Box fontWeight={500}>{borrowToken?.symbol}</Box>
                  </Box>
                </Box>
                <CardItem
                  title="Borrow Value"
                  textToEnd
                  value={`$${data?.borrow_value}`}
                />
                <Divider />
                <CardItem
                  title="Loan account"
                  textToEnd
                  value={data?.obligation}
                  isLink
                  ogValue={data?.obligation}
                  isAccount
                />
                <CardItem
                  title="Liquidator"
                  textToEnd
                  value={data?.liquidator}
                  isLink
                  ogValue={data?.liquidator}
                  isAccount
                />
                <CardItem title="LTV" textToEnd value={`${data?.ltv}%`} />
                <CardItem
                  title="Liquidation Fee"
                  textToEnd
                  value={`${data?.txn_fee ? data?.txn_fee / lamports : 0} SOL`}
                />
                <CardItem
                  title={`${data?.is_err ? "Expected Profit" : "Profit"}`}
                  textToEnd
                  value={`$${profit ? profit.toFixed(4) : 0}`}
                />
                {data?.is_err ? (
                  <CardItem
                    title="Liquidator expected repay"
                    textToEnd
                    value={`${(
                      (data?.min_acceptable_received_liquidity_amount as number) /
                        Math.pow(10, depositToken?.decimals ?? 1) +
                      (data?.fees as number) /
                        Math.pow(10, depositToken?.decimals ?? 1)
                    ).toFixed(4)} ${depositToken?.symbol}`}
                  />
                ) : null}
                {data?.is_err ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box color={colors.grey[200]}>Error Code</Box>
                    <Box
                      sx={{
                        px: "8px",
                        py: "2px",
                        borderRadius: "5px",
                        backgroundColor: "#B3311F",
                        color: "white",
                      }}
                      fontSize={16}
                    >
                      {data?.err_code}
                    </Box>
                  </Box>
                ) : null}
              </Box>
            </CardContent>
          </Card>
          <Typography variant="h6" mt={"20px"}>
            Token flow
          </Typography>
          <Card
            sx={{
              backgroundColor: "#2F264F",
            }}
          >
            <CardContent>
              <SwapItem
                tokenIn={borrowToken?.symbol ?? ""}
                tokenOut={depositToken?.symbol ?? ""}
                amountIn={
                  (
                    (data?.liquidator_repaid as number) /
                    Math.pow(10, borrowToken?.decimals ?? 1)
                  ).toFixed(2) ?? "0"
                }
                amountOut={
                  (
                    (data?.withdrew as number) /
                      Math.pow(10, depositToken?.decimals ?? 1) +
                    (data?.fees as number) /
                      Math.pow(10, depositToken?.decimals ?? 1)
                  ).toString() ?? "0"
                }
                tokenInUrl={borrowToken?.logoURI ?? "/images/solscan.png"}
                tokenOutUrl={depositToken?.logoURI ?? "/images/solscan.png"}
                icon={"arrow"}
                tokeInAddress={borrowToken?.address ?? ""}
                tokenOutAddress={depositToken?.address ?? ""}
              />
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
