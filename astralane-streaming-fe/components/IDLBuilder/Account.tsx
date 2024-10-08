import { FC } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import NumberBadge from "../NumberBadge";
import { TSelectedAccounts } from "./IDLBuilder";

type TypeIdlAccount = {
  account: {
    name: string;
    isMut: boolean;
    isSigner: boolean;
  };
  selectedAccounts: TSelectedAccounts[];
  setSelectedAccounts: (inst: TSelectedAccounts[]) => void;
  primaryIndex: number;
  index: number;
};

const Account: FC<TypeIdlAccount> = ({
  account,
  selectedAccounts,
  setSelectedAccounts,
  primaryIndex,
  index,
}) => {
  const isSelected = selectedAccounts.some((acc) => acc.name === account.name);
  const handleSelectedAccounts = () => {
    if (selectedAccounts.some((acc) => acc.name === account.name)) {
      setSelectedAccounts(
        selectedAccounts.filter((acc) => acc.name !== account.name)
      );
    } else {
      setSelectedAccounts([...selectedAccounts, account]);
    }
  };
  return (
    <div
      className={`px-3 py-4 mb-2 rounded-md ${
        isSelected ? "bg-green-600" : "bg-slate-700"
      }`}
      onClick={handleSelectedAccounts}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <NumberBadge number={Number(`${primaryIndex + 1}.${index + 1}`)} />
          <div>{account.name}</div>
          {account.isMut && (
            <div
              className={`ml-2 px-2 py-1 text-xs rounded-md w-fit font-medium bg-[#712c71] text-[#fa62fc]`}
            >
              Writeable
            </div>
          )}
          {account.isSigner && (
            <div
              className={`ml-2 px-2 py-1 text-xs rounded-md w-fit font-medium bg-[#1e5159] text-[#43b5c5]`}
            >
              Signer
            </div>
          )}
        </div>
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

export default Account;
