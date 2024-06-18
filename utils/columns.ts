import { TFilterItem } from "@/component/IndexBuilder/BuilderCard";

export const availableColumns = [
  "block_slot",
  "program_id",
  "account_arguments",
  "tx_id",
];

export const columnKeysMap = {
  block_slot: "Block slot",
  program_id: "Program id",
  account_arguments: "Account arguments",
  tx_id: "Transaction id",
};

export const columnConditions = {
  block_slot: ["gt", "lt", "eq"],
  program_id: ["eq"],
  account_arguments: ["contains"],
  tx_id: ["contains", "eq"],
};

export const conditionsKeyMap = {
  gt: "greater than",
  lt: "lesser than",
  eq: "equal to",
  in: "in",
  contains: "contains",
};
//@ts-ignore
export function removeIds(data) {
  if (Array.isArray(data)) {
    // If it's an array, iterate over each element and call removeIds recursively
    return data.map(removeIds);
  } else if (typeof data === "object" && data !== null) {
    // If it's an object, create a copy without the 'id' keys
    const newObj = {};
    for (const key in data) {
      if (key !== "id") {
        //@ts-ignore
        newObj[key] = removeIds(data[key]);
      }
    }
    return newObj;
  }
  // Base case: return primitive values as they are
  return data;
}

//Sample input for create index
// {
//     "name":"my_inde3x",
//     "table_name":"hash_indesdx_table",
//     "columns":[
//         "tx_id",
//         "data",
//         "block_slot",
//         "tx_signer",
//         "tx_success"
//     ],
//     "filters":[
//         {
//             "column":"block_slot",
//             "predicates":[
//                 {
//                     "type":"gt",
//                     "value":"33998"
//                 }
//             ]
//         }
//     ]
// }
