import React from "react";
import Sandwiches from "@/components/Sandwiches";

import Liquidations from "@/components/Liquidations";

import { Box, Tabs, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
const TabLayout = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", mt: "20px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="basic tabs example"
        >
          <Tab label="Sandwiches" color="red" />
          <Tab label="Liquidations" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Sandwiches />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Liquidations />
      </CustomTabPanel>
    </Box>
  );
};

export default TabLayout;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
