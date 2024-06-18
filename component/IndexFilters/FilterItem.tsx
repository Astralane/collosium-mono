"use client";

import {
  availableColumns,
  columnConditions,
  columnKeysMap,
  conditionsKeyMap,
} from "@/utils/columns";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { Card } from "flowbite-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { BiTrash } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { TFilterItem, TPredicate } from "../IndexBuilder/BuilderCard";
import { HiOutlineX, HiPencil, HiTrash } from "react-icons/hi";

interface FilterItemProps {
  predicates?: TPredicate[];
  column: string;
  setFilters: Dispatch<SetStateAction<TFilterItem[]>>;
  filters: TFilterItem[];
  id: string;
}

interface TConditions {
  type: string;
  id: string;
  value: string;
}

const FilterItem: React.FC<FilterItemProps> = ({
  column,
  predicates,
  setFilters,
  filters,
  id,
}) => {
  // Add your component logic here

  const [conditions, setConditions] = useState<TConditions[]>(predicates ?? []);
  const [selectedColumn, setSelectedCloumn] = useState<string>(column);
  const [isEdit, setIsedit] = useState<boolean>(false);
  const appendCondition = () => {
    const newCondition = [
      ...conditions,
      {
        id: uuidv4(),
        type: "",
        value: "",
      },
    ];
    setConditions(newCondition);
  };
  const handleUpdateCondition = (value: string, id: string, key: string) => {
    const updatedConditions = conditions.map((condition) => {
      if (condition.id === id) {
        return {
          ...condition,
          [key]: value,
        };
      }
      return condition;
    });
    setConditions(updatedConditions);
  };

  const isConditionSelected = useCallback(
    (conditionType: string) => {
      return conditions.some((item) => item.type === conditionType);
    },
    [conditions]
  );

  const isAddConditionDisabled = useMemo(
    () =>
      selectedColumn &&
      columnConditions[selectedColumn as keyof typeof columnConditions].length >
        conditions.length,
    [conditions.length, selectedColumn]
  );
  const handleSaveCondition = () => {
    const updatedFilters = filters.map((filter) => {
      if (filter.id === id) {
        return {
          ...filter,
          column: selectedColumn,
          predicates: [
            ...conditions.filter(
              (condition) =>
                Boolean(condition.type.length) &&
                Boolean(condition.value.length)
            ),
          ],
        };
      }
      return filter;
    }) as TFilterItem[];
    setFilters(updatedFilters);
    setIsedit(false);
  };
  const handleRemoveFilter = () => {
    const updatedFilter = filters.filter((item) => item.id !== id);
    setFilters(updatedFilter);
  };

  const handleRemoveCondition = (id: string) => {
    const updatedConditions = conditions.filter((item) => item.id !== id);
    setConditions(updatedConditions);
  };
  return (
    // Add your JSX code here
    <>
      {column && !isEdit ? (
        <Card>
          <div className="flex justify-between items-center">
            <div className="text-base font-medium">
              {columnKeysMap[column as keyof typeof columnKeysMap]}
            </div>
            <div className="flex justify-end items-center">
              <HiPencil
                className="h-6 w-6 mr-2 cursor-pointer"
                onClick={() => setIsedit(true)}
              />
              <HiTrash
                className="h-6 w-6 cursor-pointer"
                onClick={handleRemoveFilter}
              />
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="columns" value="Select column" />
            </div>
            <Select
              id="columns"
              onChange={(e) => setSelectedCloumn(e.target.value)}
              defaultValue={""}
              value={selectedColumn}
            >
              <option selected>Select cloumn name</option>
              {availableColumns.map((column) => (
                <option key={column} value={column}>
                  {columnKeysMap[column as keyof typeof columnKeysMap]}
                </option>
              ))}
            </Select>
          </div>

          {selectedColumn &&
            conditions.map((condition) => (
              <div className="flex items-center w-full" key={condition.id}>
                <div className="w-1/2 mr-3">
                  <div className="mb-2 block">
                    <Label htmlFor="columns" value="Select condition" />
                  </div>
                  <Select
                    id="select condition"
                    required
                    onChange={(e) =>
                      handleUpdateCondition(
                        e.target.value,
                        condition.id,
                        "type"
                      )
                    }
                    value={condition.type}
                  >
                    <option selected></option>
                    {columnConditions[
                      selectedColumn as keyof typeof columnConditions
                    ].map((condition: string) => (
                      <option
                        key={condition}
                        value={condition}
                        disabled={isConditionSelected(condition)}
                      >
                        {
                          conditionsKeyMap[
                            condition as keyof typeof conditionsKeyMap
                          ]
                        }
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="w-1/2 mr-3">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="condition value"
                      value="Enter filter value"
                    />
                  </div>
                  <TextInput
                    onChange={(e) =>
                      handleUpdateCondition(
                        e.target.value,
                        condition.id,
                        "value"
                      )
                    }
                    id="condition value"
                    type="text"
                    placeholder="122dsads"
                    value={condition.value}
                  />
                </div>
                <div
                  className="w-1/5 mt-4"
                  onClick={() => handleRemoveCondition(condition.id)}
                >
                  <HiOutlineX className="h-6 w-6 stroke-2 cursor-pointer" />
                </div>
              </div>
            ))}

          <Button
            color="dark"
            className="mt-3"
            onClick={appendCondition}
            disabled={Boolean(!isAddConditionDisabled)}
          >
            Add condition
            {/* <AiOutlinePlus className="h-4 w-4 ml-2" /> */}
          </Button>

          <div className="flex justify-end">
            <Button
              outline
              color={"success"}
              className="mr-3"
              onClick={handleSaveCondition}
            >
              <FaSave className="h-5 w-5 mr-2" /> Save
            </Button>
            <Button outline color={"failure"} onClick={handleRemoveFilter}>
              <BiTrash className="h-5 w-5 mr-2" /> Delete
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default FilterItem;
