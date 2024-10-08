import React, { Dispatch, SetStateAction } from "react";
import FilterItem from "./FilterItem";
import { TFilterItem } from "../IndexBuilder/BuilderCard";

import { AiOutlinePlus } from "react-icons/ai";

interface FiltersGroupProps {
  // Define the props for your component here
  filters: TFilterItem[];
  setFilters: Dispatch<SetStateAction<TFilterItem[]>>;
}

const FiltersGroup: React.FC<FiltersGroupProps> = ({ filters, setFilters }) => {
  // Implement your component logic here

  return (
    // JSX code for your component's UI
    <div className="space-y-4">
      {filters.map((filter, index) => (
        <div key={filter.id}>
          <FilterItem
            predicates={filter?.predicates}
            column={filter.column}
            setFilters={setFilters}
            filters={filters}
            id={filter.id}
          />
          {filters.length > 1 && index < filters.length - 1 && (
            <div className="flex w-full justify-center mt-3">
              <AiOutlinePlus size={40} color="gray" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FiltersGroup;
