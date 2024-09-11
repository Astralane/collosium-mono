"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Image src="/images/logo.png" alt="logo" height={80} width={190} />
          </Box>
          <Button color="inherit" onClick={() => router.push("/")}>
            Home
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
