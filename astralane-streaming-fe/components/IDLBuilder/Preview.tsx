import React, { FC } from "react";
import { IoReturnDownForwardSharp } from "react-icons/io5";
import { TArgumentFilter, TSelectedAccounts } from "./IDLBuilder";
import { TArg } from "./Arguments";
import { getBadgeColor } from "@/utils/common";

type TPreviewProps = {
  selectedInstructions: string[] | [];
  selectedAccounts: TSelectedAccounts[] | [];
  selectedArgs: TArg[] | [];
  filterArgument: TArgumentFilter[] | [];
};

const Preview: FC<TPreviewProps> = ({
  selectedInstructions,
  selectedAccounts,
  selectedArgs,
  filterArgument,
}) => {
  console.log(selectedArgs);
  return (
    <div>
      <div className="font-semibold mb-2">Selected Instructions: </div>
      <div className="px-4">
        {selectedInstructions.map((instruction, index) => (
          <div className="flex items-center mb-2 text-slate-300" key={index}>
            <IoReturnDownForwardSharp className="w-6 h-6 mr-2" />
            <div className="capitalize">{instruction}</div>
          </div>
        ))}
      </div>

      <div className="font-semibold mb-2">Selected Accounts: </div>
      <div className="px-4">
        {selectedAccounts.map((acc, index) => (
          <div className="flex items-center mb-2 text-slate-300" key={index}>
            <IoReturnDownForwardSharp className="w-6 h-6 mr-2" />
            <div className="capitalize">{acc.name}</div>
            {acc.isMut && (
              <div
                className={`ml-2 px-2 py-1 text-xs rounded-md w-fit font-medium bg-[#712c71] text-[#fa62fc]`}
              >
                Writeable
              </div>
            )}
            {acc.isSigner && (
              <div
                className={`ml-2 px-2 py-1 text-xs rounded-md w-fit font-medium bg-[#1e5159] text-[#43b5c5]`}
              >
                Signer
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="font-semibold mb-2">Selected Arguments: </div>
      <div className="px-4">
        {selectedArgs.map((arg, index) => (
          <>
            <div className="flex items-center mb-2 text-slate-300" key={index}>
              <IoReturnDownForwardSharp className="w-6 h-6 mr-2" />
              <div className="capitalize">{arg.name}</div>
              {/* <div
              className={`ml-2 px-2 py-1 text-xs rounded-md w-fit font-medium ${getBadgeColor(
                arg.type as string
              )}`}
            >
              {arg.type as string}
            </div> */}
            </div>
            {filterArgument.map((argFilter) => {
              if (argFilter.name === arg.name) {
                return (
                  <div
                    className="flex items-center mb-2 text-slate-300 pl-4"
                    key={argFilter.name}
                  >
                    <IoReturnDownForwardSharp className="w-6 h-6 mr-2" />
                    <div
                      className={`mr-2 px-2 py-1 text-xs rounded-md w-fit font-medium ${getBadgeColor(
                        argFilter.type
                      )}`}
                    >
                      {argFilter.type}
                    </div>
                    <div>Filter value: {argFilter.value}</div>
                  </div>
                );
              }
            })}
          </>
        ))}
      </div>
    </div>
  );
};

export default Preview;
