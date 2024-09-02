"use client";
import GraphQlSandbox from "@/components/sandbox/GraphQlSandbox";
import useFetchBackfill from "@/hooks/useFetchBackfill";
import { Button, Tooltip } from "flowbite-react";
import { HiOutlineClipboard } from "react-icons/hi";
import { Progress, Clipboard } from "flowbite-react";
import { useMemo } from "react";
import { BsCaretRight } from "react-icons/bs";
import useStartBackfill from "@/hooks/useStartBackfill";

export default function IndexDetails({ params }: { params: { id: string } }) {
  const { data, isFetching, error } = useFetchBackfill(params.id);
  const { mutate, isPending } = useStartBackfill();
  const isbackFillStarted = useMemo(() => {
    if (error?.statusCode === 404) {
      return false;
    } else {
      return true;
    }
  }, [error]);

  return (
    <div className="mb-9">
      <div className="text-xl">Index Details</div>

      <div className=" mt-6">
        <div className="mb-5">
          <div className="text-slate-400">Deployment Index Id</div>
          <div className="flex gap-1 items-center">
            <div className="bg-gray-700 border border-gray-600 text-slate-200 rounded-[4px] px-1 font-normal text-sm w-fit relative">
              {params.id}
              {/* <Clipboard.WithIcon
                valueToCopy={params.id}
                // className="right-10"
              /> */}
            </div>

            {/* <Clipboard.WithIcon valueToCopy="npm install flowbite-react" /> */}
          </div>
        </div>

        <div className="mb-5">
          <div className="text-slate-400">Public GraphQL link</div>
          <div className="text-[#3B82F6]  grid w-full">
            <div className="relative">
              <div className="col-span-6 block w-ful">
                http://a4-server:4001/api/v1/dataset/{params.id}/graphql
              </div>
              {/* <Clipboard.WithIcon
                valueToCopy={`http://a4-server:4001/api/v1/dataset/${params.id}/graphql`}
                className="right-10"
              /> */}
            </div>
          </div>
        </div>

        <div>
          <div className="text-slate-400 mb-2">Backfill status</div>

          {!isFetching && isbackFillStarted && (
            <div className="flex items-center justify-between">
              <div
                className={`mb-4 status-indicator  p-1.5 inline-flex flex-nowrap gap-1 items-center flex-grow-0 border h-5 rounded-[5px] ${
                  data?.status === "completed"
                    ? "bg-[#ECFCCB]"
                    : data?.status === "in_progress"
                    ? "bg-yellow-200"
                    : "bg-red-300"
                }`}
              >
                <div
                  className={`rounded-full w-1.5 h-1.5 ${
                    data?.status === "completed"
                      ? "bg-green-500"
                      : data?.status === "in_progress"
                      ? "bg-yellow-400"
                      : "bg-red-500"
                  }`}
                ></div>
                {data?.status && data.status === "not_started" ? (
                  <span className="text-[#b22422] text-sm">Not started</span>
                ) : data?.status === "in_progress" ? (
                  <span className="text-[#a4931e] text-sm">In progress</span>
                ) : (
                  <span className="text-[#15803D] text-sm">Completed</span>
                )}
              </div>
              {/* <div className="bg-red-400 color-white">
             <HiOutlinePause className="mr-2 h-5 w-5" />
             Buy now
           </div> */}
            </div>
          )}
          {!isbackFillStarted && (
            <Button
              size={"xs"}
              onClick={() => mutate(params.id)}
              isProcessing={isPending}
            >
              <BsCaretRight className="w-4 h-4 mr-2" /> Start backfill
            </Button>
          )}
        </div>
        {isbackFillStarted && !isFetching && (
          <div>
            <Progress progress={data?.percentage ? data.percentage * 100 : 0} />
            <div className="flex justify-between">
              <div className="text-xs text-slate-300">0 block</div>
              <div className="text-xs text-slate-300">
                {data?.last_processed_block ?? 0} blocks
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-[800px] mt-6">
        <div className="mb-4 text-slate-400">Graphql Playground</div>
        {/* <GraphQlSandbox
          endpoint={` http://a4-server:4001/api/v1/dataset/${params.id}/graphql`}
        /> */}
      </div>
    </div>
  );
}
