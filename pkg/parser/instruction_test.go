package parser

import "testing"

func testCfgParsing(t *testing.T) {
}

var jsonSample = `{
    "name": "All Memos from 09:10:00 to 09:11:40",
    "table_name": "test_table",
    "columns": [
        "block_slot",
        "tx_id",
        "tx_index",
        "program_id",
        "is_inner",
        "data",
        "account_arguments",
        "tx_signer",
        "tx_success"
    ],
    "filters": [
        {
            "column": "account_arguments",
            "predicates": [
                {
                    "type": "lt",
                    "value": ["4dv4puYib9XZXHrTN5csFxzfWKSmetTu1dLsJWNNV2XZ"]
                }
            ]
        }
    ]
}`
