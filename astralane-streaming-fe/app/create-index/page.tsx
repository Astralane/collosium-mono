"use client";
import BuilderCard from "@/components/IndexBuilder/BuilderCard";
import { Tabs } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import IDLBuilder from "@/components/IDLBuilder/IDLBuilder";

export default function CreateIndex() {
  return (
    <main>
      {/* <Tabs aria-label="Pills" variant="pills">
        <Tabs.Item active title="Raw index" icon={HiUserCircle}>
          <BuilderCard />
        </Tabs.Item>
        <Tabs.Item title="With IDL" icon={MdDashboard}>
          asdcasdc
        </Tabs.Item>
      </Tabs> */}
      <div className="w-full">
        <TabGroup>
          <TabList className="flex gap-4">
            <Tab
              key={"raw_index"}
              className="rounded py-1 px-3 text-lg  font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              Raw index
            </Tab>
            <Tab
              key={"IDL"}
              className="rounded py-1 px-3 text-lg font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              With IDL
            </Tab>
          </TabList>
          <TabPanels className="mt-3">
            <TabPanel key={"raw_index"} className="rounded-xl  p-3">
              <BuilderCard />
            </TabPanel>
            <TabPanel key={"IDL"} className="rounded-xl p-3">
              <IDLBuilder />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </main>
  );
}
