"use client";
import { FC } from "react";
import { Tabs } from "flowbite-react";

const MainTab: FC = () => {
  return (
    <Tabs aria-label="Tabs">
      <Tabs.Item active title="Index builder">
        This is{" "}
        <span className="font-medium text-gray-800 dark:text-white">
          Profile tabs associated content
        </span>
        . Clicking another tab will toggle the visibility of this one for the
        next. The tab JavaScript swaps classes to control the content visibility
        and styling.
      </Tabs.Item>
      <Tabs.Item title="My indices">
        This is{" "}
        <span className="font-medium text-gray-800 dark:text-white">
          Dashboard tabs associated content
        </span>
        . Clicking another tab will toggle the visibility of this one for the
        next. The tab JavaScript swaps classes to control the content visibility
        and styling.
      </Tabs.Item>
      <Tabs.Item title="Account">
        This is{" "}
        <span className="font-medium text-gray-800 dark:text-white">
          Settings tabs associated content
        </span>
        . Clicking another tab will toggle the visibility of this one for the
        next. The tab JavaScript swaps classes to control the content visibility
        and styling.
      </Tabs.Item>
    </Tabs>
  );
};

export default MainTab;
