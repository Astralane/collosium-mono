import React, { FC } from "react";
type TNumberBadge = {
  number: number;
};
const NumberBadge: FC<TNumberBadge> = ({ number }) => {
  return (
    <span className="bg-[#116939] px-1.5 py-1 rounded-md text-[#26e97e] mr-1 text-sm font-semibold">
      #{number}
    </span>
  );
};

export default NumberBadge;
