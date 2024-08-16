import { IdlAccount, IdlInstruction } from "@/app/types/idl";
import useCreateIndex from "@/hooks/useCreateIndex";
import useFetchIdl from "@/hooks/useFetchIdl";
import { Button, Card, Label, TextInput } from "flowbite-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";

import { toast } from "react-toastify";

const IDLBuilder = () => {
  const [pubKey, setPubKey] = useState<string | undefined>();
  const [indexName, setIndexName] = useState<string | undefined>();
  const { data, refetch, error, isError: isIdlFetchError } = useFetchIdl(
    pubKey
  );
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>(
    []
  );
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedArgs, setSelectedArgs] = useState<string[]>([]);
  const { mutate, isPending, isSuccess, isError } = useCreateIndex(
    handleSuccess
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
    ];
    if (selectedInstructions.length > 0) {
      columns.push("instruction_name");
      filters.push({
        column: "instruction_name",
        predicates: [{ type: "eq", value: [...selectedInstructions] }],
      });
    }
    const accounts = selectedAccounts.map((account) => {
      return `account_${account}`;
    });
    const args = selectedArgs.map((arg) => {
      return `arg_${arg}`;
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
      {data && data?.instructions && (
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
              />
            ))}
          </div>
          <div>
            <Button
              className="w-full"
              onClick={handleCreateIndex}
              disabled={indexName === "" || !indexName}
            >
              Create Index
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default IDLBuilder;

type TypeIdlInstruction = {
  instruction: IdlInstruction;
  selectedInstructions: string[];
  setSelectedInstructions: (inst: string[]) => void;
  index: number;
  selectedAccounts: string[];
  setSelectedAccounts: (inst: string[]) => void;
  selectedArgs: string[];
  setSelectedArgs: (inst: string[]) => void;
};
const Instruction: FC<TypeIdlInstruction> = ({
  instruction,
  selectedInstructions,
  setSelectedInstructions,
  selectedAccounts,
  setSelectedAccounts,
  selectedArgs,
  setSelectedArgs,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const handleAddInstruction = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (selectedInstructions.includes(instruction.name)) {
      setSelectedInstructions(
        selectedInstructions.filter((inst) => inst !== instruction.name)
      );
    } else {
      setSelectedInstructions([...selectedInstructions, instruction.name]);
    }
  };
  const isSelected = selectedInstructions.includes(instruction.name);
  return (
    <div
      className={`last:mb-0 mb-3  ${
        isOpen && "last:border-b-0 border-b border-gray-300 mb-5 pb-2"
      }`}
    >
      <div
        className={`border  rounded-lg flex justify-between items-center p-4 cursor-pointer ${
          isSelected
            ? "bg-green-600 border-green-600"
            : "border-gray-700 bg-slate-700"
        }`}
        onClick={toggleAccordion}
      >
        <span className="font-semibold text-slate-300">
          {index + 1}.{instruction.name}
        </span>
        <span
          className="material-icons"
          onClick={(e) => handleAddInstruction(e)}
        >
          {isSelected ? (
            <AiOutlineDelete className="h-5 w-5" />
          ) : (
            <AiOutlinePlusCircle className="h-5 w-5" />
          )}
        </span>
      </div>
      {isOpen && (
        <>
          <div className="p-4">
            <div className="text-slate-200 uppercase mb-2">Input Accounts</div>
            {instruction.accounts.map((account, index) => (
              <Account
                key={index}
                account={account}
                selectedAccounts={selectedAccounts}
                setSelectedAccounts={setSelectedAccounts}
              />
            ))}
          </div>

          <div className="p-4">
            <div className="text-slate-200 uppercase mb-2">
              Input Arguments/Fields
            </div>
            {instruction.args.length === 0 && (
              <div className="mt-2 text-slate-400">No Arguments</div>
            )}
            {instruction.args.map((arg, index) => (
              <Arguments
                key={index}
                arg={arg}
                selectedArgs={selectedArgs}
                setSelectedArgs={setSelectedArgs}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
type TypeIdlAccount = {
  account: {
    name: string;
  };
  selectedAccounts: string[];
  setSelectedAccounts: (inst: string[]) => void;
};

const Account: FC<TypeIdlAccount> = ({
  account,
  selectedAccounts,
  setSelectedAccounts,
}) => {
  const isSelected = selectedAccounts.includes(account.name);
  const handleSelectedAccounts = () => {
    if (selectedAccounts.includes(account.name)) {
      setSelectedAccounts(
        selectedAccounts.filter((acc) => acc !== account.name)
      );
    } else {
      setSelectedAccounts([...selectedAccounts, account.name]);
    }
  };
  return (
    <div
      className={`p-2 mb-2 rounded-md ${
        isSelected ? "bg-green-600" : "bg-slate-700"
      }`}
      onClick={handleSelectedAccounts}
    >
      <div className="flex justify-between items-center">
        <span>{account.name}</span>
        <span className="material-icons cursor-pointer">
          {isSelected ? (
            <AiOutlineDelete className="h-5 w-5" />
          ) : (
            <AiOutlinePlusCircle className="h-5 w-5" />
          )}
        </span>
      </div>
      {/* <div className="text-sm text-gray-600">
        <p>Is Mutable: {account.isMut.toString()}</p>
        <p>Is Signer: {account.isSigner.toString()}</p>
      </div> */}
    </div>
  );
};

type TypeIdlArguments = {
  arg: {
    name: string;
  };
  selectedArgs: string[];
  setSelectedArgs: (inst: string[]) => void;
};
const Arguments: FC<TypeIdlArguments> = ({
  arg,
  selectedArgs,
  setSelectedArgs,
}) => {
  const isSelected = selectedArgs.includes(arg.name);
  const handleSelectedAccounts = () => {
    if (selectedArgs.includes(arg.name)) {
      setSelectedArgs(selectedArgs.filter((acc) => acc !== arg.name));
    } else {
      setSelectedArgs([...selectedArgs, arg.name]);
    }
  };
  return (
    <div
      className={`p-2 mb-2 rounded-md ${
        isSelected ? "bg-green-600" : "bg-slate-700"
      }`}
      onClick={handleSelectedAccounts}
    >
      <div className="flex justify-between items-center">
        <span>{arg.name}</span>
        <span className="material-icons cursor-pointer">
          {isSelected ? (
            <AiOutlineDelete className="h-5 w-5" />
          ) : (
            <AiOutlinePlusCircle className="h-5 w-5" />
          )}
        </span>
      </div>
      {/* <div className="text-sm text-gray-600">
        <p>Is Mutable: {account.isMut.toString()}</p>
        <p>Is Signer: {account.isSigner.toString()}</p>
      </div> */}
    </div>
  );
};
