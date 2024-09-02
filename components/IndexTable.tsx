"use client";

import { Button, Spinner, Table, TableCell } from "flowbite-react";
import { FC, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useFetchMyIndexes from "@/hooks/useFetchMyIndexes";
import { useRouter } from "next/navigation";

const IndexTable: FC = () => {
  const router = useRouter();
  const { data, isLoading } = useFetchMyIndexes();
  const indexData = useMemo(() => data ?? [], [data]);
  const openGraphQLPlayground = (url: string) => {
    window.open(url, "_blank");
  };
  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>Index name</Table.HeadCell>
          <Table.HeadCell>Id</Table.HeadCell>

          <Table.HeadCell>Graphql URL</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {!isLoading &&
            indexData.map((data) => {
              return (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={data.index_id}
                >
                  <Table.Cell key={data.name}>{data.name}</Table.Cell>
                  <Table.Cell key={data.index_id}>
                    {data.index_id.replace(/-/g, "_")}
                  </Table.Cell>

                  <Table.Cell key={uuidv4()}>
                    <div
                      //href={`localhost:3000/api/v1/dataset/${data.index_id}/graphql`}
                      onClick={() =>
                        openGraphQLPlayground(
                          `http://a4-server:4001/api/v1/dataset/${data.index_id}/graphql`
                        )
                      }
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      {`http://a4-server:4001/api/v1/dataset/${data.index_id}/graphql`}
                    </div>
                  </Table.Cell>
                  <Table.Cell key={uuidv4()}>
                    <Button
                      onClick={() =>
                        router.push(`/my-indices/${data.index_id}`)
                      }
                      size={"sm"}
                    >
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
      {!isLoading && !data && (
        <div className="flex justify-center mt-2 text-lg text-center w-full ">
          No data found
        </div>
      )}
      {isLoading && !data && (
        <div className="flex justify-center w-full">
          <Spinner
            aria-label="Default status example"
            className="h-8 w-8 mt-5"
          />
        </div>
      )}
    </div>
  );
};
export default IndexTable;
