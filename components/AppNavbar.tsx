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
import { usePathname } from "next/navigation";
const navLinks = {
  IndexBuilder: "/create-index",
  MyIndices: "/my-indices",
  AccountSettings: "#",
};

const AppNavbar: FC = () => {
  const pathname = usePathname();
  return (
    <Sidebar
      aria-label="Sidebar with logo branding example"
      className="h-screen"
    >
      <Sidebar.Items className="text-2xl  mb-4">
        <img src="/images/logo.png" alt="" className="logo" />
      </Sidebar.Items>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href={navLinks.IndexBuilder}
            icon={HiChartPie}
            active={pathname === navLinks.IndexBuilder}
          >
            Index builder
          </Sidebar.Item>
          <Sidebar.Item
            href={navLinks.MyIndices}
            icon={HiViewBoards}
            active={pathname === navLinks.MyIndices}
          >
            My indices
          </Sidebar.Item>
          <Sidebar.Item
            href={navLinks.AccountSettings}
            icon={HiInbox}
            active={pathname === navLinks.AccountSettings}
          >
            Account settings
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AppNavbar;
