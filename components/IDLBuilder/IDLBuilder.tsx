import useCreateIndex from "@/hooks/useCreateIndex";
import useFetchIdl from "@/hooks/useFetchIdl";
import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import Instruction from "./Instruction";
import Preview from "./Preview";
import { TArg } from "./Arguments";
import { useRouter } from "next/navigation";
export type TArgumentFilter = {
  name: string;
  type: string;
  value: any;
};
export type TSelectedAccounts = {
  name: string;
  isMut: boolean;
  isSigner: boolean;
};

const IDLBuilder = () => {
  const router = useRouter();
  const [pubKey, setPubKey] = useState<string | undefined>();
  const [step, setStep] = useState<number>(1);
  const [indexName, setIndexName] = useState<string | undefined>();
  const {
    data,
    refetch,
    error,
    isError: isIdlFetchError,
    isPending: isFetchingIDL,
    isLoading,
  } = useFetchIdl(pubKey);
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>(
    []
  );
  const [selectedAccounts, setSelectedAccounts] = useState<TSelectedAccounts[]>(
    []
  );
  const [selectedArgs, setSelectedArgs] = useState<TArg[]>([]);
  const { mutate, isPending, isSuccess, isError } =
    useCreateIndex(handleSuccess);
  const [filterArgument, setFilterArgument] = useState<TArgumentFilter[] | []>(
    []
  );
  const handleFetchIdl = () => {
    if (pubKey !== "") {
      refetch();
      ///setPubKey(pubKey);
    }
  };
  useEffect(() => {
    console.log(data);
  }, [data]);
  const handleCreateIndex = () => {
    let columns = ["block_slot", "tx_id", "program_id"];
    let filters = [];

    filters = [
      {
        column: "program_id",
        predicates: [{ type: "eq", value: [pubKey] }],
      },
      {
        column: "time",
        predicates: [
          {
            type: "gt",
            value: ["1718148175"],
          },
          {
            type: "lt",
            value: ["1718179227"],
          },
        ],
      },
    ];
    filterArgument.map((arg) => {
      selectedArgs.some((item) => item.name == arg.name) &&
        filters.push({
          column: `arg_${arg.name}`,
          predicates: [{ type: "eq", value: [arg.value] }],
        });
    });
    if (selectedInstructions.length > 0) {
      columns.push("instruction_name");
      filters.push({
        column: "instruction_name",
        predicates: [{ type: "eq", value: [...selectedInstructions] }],
      });
    }
    const accounts = selectedAccounts.map((account) => {
      return `account_${account.name}`;
    });
    const args = selectedArgs.map((arg) => {
      return `arg_${arg.name}`;
    });

    columns = [...columns, ...accounts, ...args];
    const reqBody = {
      name: indexName,
      ...(columns.length > 0 && { columns: [...columns] }),
      filters,
    };
    mutate(reqBody);
  };
  function handleSuccess(data: any) {
    toast.success("Index created successfully!", {
      position: "top-right",
    });
    setIndexName("");
    router.push("/my-indices");
    // setFilters([]);
  }

  useEffect(() => {
    console.log(error, isIdlFetchError);
    if (isIdlFetchError) {
      toast.error("IDL not found for the public key", {
        position: "top-right",
      });
    }
  }, [error, isIdlFetchError]);
  console.log(isFetchingIDL);
  return (
    <div className="w-full flex justify-center flex-col items-center">
      <Card className="w-full max-w-4xl bg-slate-800">
        <div className="w-full">
          <div className="mb-2 block">
            <Label htmlFor="pubkey" value="Enter program public key" />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-full">
              <TextInput
                id="pubkey"
                type="text"
                placeholder="Eg: 1111111111111111111111"
                onChange={(e) => setPubKey(e.target.value)}
                value={pubKey}
              />
            </div>
            <Button
              className="w-full"
              disabled={!Boolean((pubKey && pubKey.length > 0) || pubKey)}
              onClick={handleFetchIdl}
            >
              Fetch IDL
            </Button>
          </div>
        </div>
      </Card>
      {!isLoading && data && data?.instructions && (
        <Card className="w-full max-w-4xl mt-5">
          <div>
            <div className="mb-1">
              Program Id: <span className="text-slate-300">{pubKey}</span>
            </div>
            <div className="mb-1">
              Name: <span className="text-slate-300">{data?.name}</span>{" "}
            </div>
            <div>
              Version: <span className="text-slate-300"> {data?.version} </span>
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="indexName" value="Index name" />
            </div>
            <div className="w-full">
              <TextInput
                id="indexName"
                type="text"
                placeholder="eg: candy-machine-nft-watchlist"
                onChange={(e) => setIndexName(e.target.value)}
                //value={pubKey}
              />
            </div>
          </div>
          {step === 1 && (
            <>
              <div className="text-xl mt-4">Instructions</div>
              <div className="max-w-4xl mx-auto w-full max-h-[800px] overflow-y-scroll p-3">
                {data?.instructions.map((instruction, index) => (
                  <Instruction
                    key={index}
                    instruction={instruction}
                    selectedInstructions={selectedInstructions}
                    setSelectedInstructions={setSelectedInstructions}
                    index={index}
                    selectedAccounts={selectedAccounts}
                    setSelectedAccounts={setSelectedAccounts}
                    selectedArgs={selectedArgs}
                    setSelectedArgs={setSelectedArgs}
                    types={data.types}
                    filterArgument={filterArgument}
                    setFilterArgument={setFilterArgument}
                  />
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <Preview
              selectedInstructions={selectedInstructions}
              selectedAccounts={selectedAccounts}
              selectedArgs={selectedArgs}
              filterArgument={filterArgument}
            ></Preview>
          )}
          <div className="flex justify-end items-center gap-4">
            {step == 2 && (
              <Button
                onClick={() => setStep(1)}
                color={"gray"}
                // disabled={indexName === "" || !indexName}
                className="w-[20%]"
              >
                Back
              </Button>
            )}
            <Button
              onClick={step === 1 ? () => setStep(2) : handleCreateIndex}
              disabled={step === 2 && (indexName === "" || !indexName)}
              className="w-[20%]"
            >
              {step === 2 ? "Create Index" : "Preview"}
            </Button>
          </div>
        </Card>
      )}
      {isLoading && !data && (
        <div>
          <Spinner aria-label="Default status example" />
        </div>
      )}
    </div>
  );
};

export default IDLBuilder;
