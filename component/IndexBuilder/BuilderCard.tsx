"use client";
import React, { use, useEffect, useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import FiltersGroup from "../IndexFilters/FiltersGroup";
import { v4 as uuidv4 } from "uuid";
import { removeIds } from "@/utils/columns";
import useCreateIndex from "@/hooks/useCreateIndex";
import { toast } from "react-toastify";

export interface TFilterItem {
  id: string;
  column: string;
  predicates?: TPredicate[];
}

export interface TPredicate {
  id: string;
  type: string;
  value: string;
}

const BuilderCard = () => {
  const [filters, setFilters] = useState<TFilterItem[] | []>([]);
  const [indexName, setIndexName] = useState<string>();
  const { mutate, isPending, isSuccess, data } = useCreateIndex(handleSuccess);
  const appendFilter = () => {
    const updatedFilters = [
      ...filters,
      {
        id: uuidv4(),
        column: "",
      },
    ];
    setFilters(updatedFilters);
  };

  const handleCreateIndex = () => {
    mutate({
      name: indexName,
      table_name: indexName,
      columns: ["tx_id", "data", "block_slot", "tx_signer", "tx_success"],
      filters: removeIds(filters),
    });
  };

  function handleSuccess(data: any) {
    toast.success("Index created successfully!", {
      position: "top-right",
    });
    const prevData = localStorage.getItem("myIndex");
    if (prevData) {
      localStorage.setItem(
        "myIndex",
        JSON.stringify([
          {
            id: data.data,
            name: indexName,
            date: new Date().toLocaleString(),
          },
          ...(JSON.parse(prevData) as unknown as []),
        ])
      );
    } else {
      localStorage.setItem(
        "myIndex",
        JSON.stringify([
          {
            id: data.data,
            name: indexName,
            date: new Date().toLocaleString(),
          },
        ])
      );
    }
    setIndexName("");
    setFilters([]);
  }
  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-4xl">
        <h5 className="text-2xl   dark:text-white">Create a new index</h5>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="index_name" value="Index name" />
          </div>
          <TextInput
            id="index_name"
            type="text"
            placeholder="eg: bayc-nft-watchlist"
            onChange={(e) => setIndexName(e.target.value)}
            value={indexName}
          />
        </div>
        <div className="text-2xl">Solana Transactions</div>
        <div className="text-xl font-medium">Filters</div>
        <FiltersGroup filters={filters} setFilters={setFilters} />
        <Button outline color="light" onClick={appendFilter}>
          Add filter
        </Button>

        <div className="w-full mt-6">
          <Button
            className="w-full"
            onClick={handleCreateIndex}
            disabled={!Boolean(indexName)}
            isProcessing={isPending}
          >
            Create index
            {/* <svg
              className="-mr-1 ml-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg> */}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BuilderCard;
