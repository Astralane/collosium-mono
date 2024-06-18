"use client";

import { Sidebar } from "flowbite-react";
import { FC } from "react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

const AppNavbar: FC = () => {
  return (
    <Sidebar
      aria-label="Sidebar with logo branding example"
      className="h-screen"
    >
      <Sidebar.Items className="text-2xl  mb-4">
        Astralane Indexer
      </Sidebar.Items>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/create-index" icon={HiChartPie}>
            Index builder
          </Sidebar.Item>
          <Sidebar.Item href="/my-indices" icon={HiViewBoards}>
            My indices
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiInbox}>
            Account settings
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AppNavbar;
