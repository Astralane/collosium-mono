import Sandwiches from "@/components/Sandwiches";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",

        justifyContent: "center",
        alignItems: "center",
        marginTop: "30px",
      }}
    >
      <Typography variant="h4">Astralane Solana Sandwich Monitor</Typography>
      <Sandwiches />
    </Box>
  );
}
