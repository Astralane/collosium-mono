"use client";

import { Table } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
interface TIndexData {
  date: string;
  id: string;
  name: string;
}
const IndexTable: FC = () => {
  const [indexData, setIndexData] = useState<TIndexData[] | []>([]);
  useEffect(() => {
    const getData = localStorage.getItem("myIndex") as string;
    setIndexData(JSON.parse(getData));
  }, []);
  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>Index name</Table.HeadCell>
          <Table.HeadCell>Id</Table.HeadCell>
          <Table.HeadCell>Created at</Table.HeadCell>
          <Table.HeadCell>Graphql URL</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {indexData.map((data) => {
            return (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={data.id}
              >
                <Table.Cell key={data.name}>{data.name}</Table.Cell>
                <Table.Cell key={data.id}>
                  {data.id.replace(/-/g, "_")}
                </Table.Cell>
                <Table.Cell key={data.date}>{data.date}</Table.Cell>

                <Table.Cell key={uuidv4()}>
                  <a
                    href={`localhost:3000/api/v1/dataset/${data.id}/graphql`}
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    {`localhost:3000/api/v1/dataset/${data.id}/graphql`}
                  </a>
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
