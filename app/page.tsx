import Sandwiches from "@/components/Sandwiches";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        marginTop: "30px",
        padding: "20px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h4" textAlign={"center"} mb={"20px"}>
          Astralane Solana Sandwich Monitor
        </Typography>

        <Sandwiches />
      </Box>
    </Box>
  );
}
