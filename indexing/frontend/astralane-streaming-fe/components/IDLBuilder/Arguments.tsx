import { getBadgeColor } from "@/utils/common";
import { Badge, Checkbox, Table, TableCell, TextInput } from "flowbite-react";
import React, {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { TArgumentFilter } from "./IDLBuilder";

type TypeIdlArguments = {
  types: any;
  arg: TArg;
  selectedArgs: TArg[];
  setSelectedArgs: (inst: TArg[]) => void;
  filterArgument: TArgumentFilter[];
  setFilterArgument: Dispatch<SetStateAction<[] | TArgumentFilter[]>>;
};
export type TArg = {
  name: string;
  type: ArgType;
};
type ArgType =
  | string // For simple types like "u64", "bool", "publicKey", etc.
  | { defined: string } // For defined types like { "defined": "CandyMachineData" }
  | { option: string } // For optional types like { "option": "i64" }
  | { array: [string, number] } // For array types like [u8; 32]
  | {
      vec: {
        defined: string;
      };
    }; // For vector types like Vec<u8>

const Arguments: FC<TypeIdlArguments> = ({
  arg,
  selectedArgs,
  setSelectedArgs,
  types,
  filterArgument,
  setFilterArgument,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isSelected = selectedArgs.some((item) => item.name === arg.name);

  const handleSelectedAccounts = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (isSelected) {
      setSelectedArgs(selectedArgs.filter((acc) => acc.name !== arg.name));
    } else {
      setSelectedArgs([...selectedArgs, arg]);
    }
  };

  const toggleAccordion = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  const renderTypeWithBadge = (type: string) => {
    return (
      <div
        className={`px-2 py-1 ${getBadgeColor(
          type
        )} text-xs rounded-md w-fit font-medium`}
      >
        {type}
      </div>
    );
  };
  const handleFilterArgument = useCallback(
    (name: string, type: string, e: React.ChangeEvent<HTMLInputElement>) => {
      if (filterArgument.some((arg) => arg.name === name)) {
        setFilterArgument(
          filterArgument.map((arg) => {
            if (arg.name === name) {
              return { ...arg, value: e.target.value };
            }
            return arg;
          })
        );
      } else {
        setFilterArgument([
          ...filterArgument,
          { name, type, value: e.target.value },
        ]);
      }
    },
    [filterArgument]
  );
  console.log(filterArgument);
  const generateRows = (name: string, type: ArgType): JSX.Element[] => {
    if (typeof type === "string") {
      return [
        <Table.Row
          key={name}
          className="text-white border-gray-400 bg-gray-600"
        >
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>{renderTypeWithBadge(type)}</Table.Cell>
          {isPrimitive(arg) && (
            <Table.Cell>
              <TextInput
                type="string"
                placeholder="Enter value to index"
                onChange={(e) => handleFilterArgument(name, type, e)}
              ></TextInput>
            </Table.Cell>
          )}
        </Table.Row>,
      ];
    } else if ("defined" in type) {
      const definedType = types.find((t: any) => t.name === type.defined);
      if (definedType && definedType.type.kind === "struct") {
        return definedType.type.fields.flatMap((field: any) =>
          generateRows(`${field.name}`, field.type)
        );
      } else {
        return [
          <Table.Row
            key={name}
            className="text-white border-gray-400 bg-gray-600"
          >
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>{renderTypeWithBadge(type.defined)}</Table.Cell>
          </Table.Row>,
        ];
      }
    } else if ("option" in type) {
      return generateRows(`${name}`, type.option);
    } else if ("array" in type) {
      return generateRows(`${name}`, type.array[0]);
    } else if ("vec" in type) {
      return generateRows(`${name}`, type.vec);
    }
    return [];
  };
  const isPrimitive = (arg: TArg) => {
    if (typeof arg.type === "string") {
      return true;
    }
    if (
      typeof arg.type === "object" &&
      "option" in arg.type &&
      typeof arg.type.option === "string"
    ) {
      return true;
    }
    return false;
  };
  return (
    <div className={`mb-2`}>
      <div
        className={`p-2 rounded-md flex justify-between items-center ${
          isSelected ? "bg-green-600" : "bg-slate-700"
        }`}
      >
        <div className="flex items-center">
          <Checkbox
            className="mr-2 cursor-pointer"
            onChange={(e) => handleSelectedAccounts(e)}
            checked={isSelected}
            color={"success"}
            height={18}
            width={18}
          />
          <span>{arg.name} Args</span>
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
        <div className="p-4">
          <Table>
            <Table.Head>
              <Table.HeadCell className="text-white">Name</Table.HeadCell>
              <Table.HeadCell className="text-white">Type</Table.HeadCell>
              {isPrimitive(arg) && <Table.HeadCell>Value</Table.HeadCell>}
            </Table.Head>
            <Table.Body className="divide-y">
              {generateRows(arg.name, arg.type)}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default memo(Arguments);
