"use client";

import { Table } from "flowbite-react";
import { FC, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useFetchMyIndexes from "@/hooks/useFetchMyIndexes";

const IndexTable: FC = () => {
  const { data } = useFetchMyIndexes();
  const indexData = useMemo(() => data ?? [], [data]);
  const openGraphQLPlayground = (url: string) => {
    const playgroundUrl = `https://www.graphqlbin.com/?query=${encodeURIComponent(
      url
    )}`;
    window.open(playgroundUrl, "_blank");
  };
  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>Index name</Table.HeadCell>
          <Table.HeadCell>Id</Table.HeadCell>

          <Table.HeadCell>Graphql URL</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {indexData.map((data) => {
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
                        `http://198.244.253.172:3001/api/v1/dataset/${data.index_id}/graphql`
                      )
                    }
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    {`localhost:3000/api/v1/dataset/${data.index_id}/graphql`}
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
export default IndexTable;
