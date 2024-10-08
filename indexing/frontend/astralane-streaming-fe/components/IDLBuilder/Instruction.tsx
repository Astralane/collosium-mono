import { IdlInstruction } from "@/app/types/idl";
import { Dispatch, FC, SetStateAction, useState } from "react";
import NumberBadge from "../NumberBadge";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import Account from "./Account";
import Arguments, { TArg } from "./Arguments";
import { Checkbox } from "flowbite-react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { TArgumentFilter, TSelectedAccounts } from "./IDLBuilder";

type TypeIdlInstruction = {
  instruction: IdlInstruction;
  selectedInstructions: string[];
  setSelectedInstructions: (inst: string[]) => void;
  index: number;
  selectedAccounts: TSelectedAccounts[];
  setSelectedAccounts: (inst: TSelectedAccounts[]) => void;
  selectedArgs: TArg[];
  setSelectedArgs: (inst: TArg[]) => void;
  types: any;
  filterArgument: TArgumentFilter[];
  setFilterArgument: Dispatch<SetStateAction<[] | TArgumentFilter[]>>;
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
  types,
  filterArgument,
  setFilterArgument,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleAddInstruction = (
    e: React.SyntheticEvent<HTMLInputElement, Event>
  ) => {
    e.stopPropagation();
    //e.preventDefault();

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
        isOpen && " mb-5 pb-2 bg-[#0B051B] rounded-lg"
      }`}
    >
      <div
        className={`border  rounded-lg flex justify-between items-center px-3 py-4 ${
          isSelected
            ? "bg-green-600 border-green-600"
            : "border-gray-700 bg-slate-700"
        } ${isOpen && "rounded-b-none"}`}
      >
        <div className="flex items-center">
          {/* <span
            className="material-icons"
            onClick={(e) => handleAddInstruction(e)}
          >
            {isSelected ? (
              <AiOutlineDelete className="h-5 w-5" />
            ) : (
              <AiOutlinePlusCircle className="h-5 w-5" />
            )}
          </span> */}
          <Checkbox
            className="mr-2 cursor-pointer"
            onChange={(e) => handleAddInstruction(e)}
            checked={isSelected}
            color={"success"}
            height={18}
            width={18}
          ></Checkbox>
          <span className="font-semibold text-slate-300">
            <NumberBadge number={index + 1} />
            <span className="capitalize"> {instruction.name}</span>
          </span>
        </div>
        {isOpen ? (
          <GoChevronUp
            className="h-6 w-6 stroke-1 cursor-pointer"
            onClick={(e) => toggleAccordion(e)}
          />
        ) : (
          <GoChevronDown
            className="h-6 w-6 stroke-1 cursor-pointer"
            onClick={(e) => toggleAccordion(e)}
          />
        )}
      </div>
      {isOpen && (
        <>
          <div className="p-4">
            <div className="text-slate-200 uppercase mb-2">Input Accounts</div>
            {instruction.accounts.map((account, i) => (
              <Account
                key={i}
                account={account}
                selectedAccounts={selectedAccounts}
                setSelectedAccounts={setSelectedAccounts}
                primaryIndex={index}
                index={i}
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
                types={types}
                filterArgument={filterArgument}
                setFilterArgument={setFilterArgument}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Instruction;
