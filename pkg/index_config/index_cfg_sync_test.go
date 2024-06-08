package index_config

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func testCfgParsing(t *testing.T) {
	cfg := parseJsonCfg([]byte(jsonSample))

	name := cfg.Name
	assert.Equal(t, "Test name", name)

	tableName := cfg.TableName
	assert.Equal(t, "test_table", tableName)

	filters := cfg.Filters
	assert.Equal(t, expectedFilters, filters)

	columns := cfg.Columns
	assert.Equal(t, expectedColumns, columns)
}

var expectedColumns = []string{
	"block_slot",
	"tx_id",
	"tx_index",
	"program_id",
	"is_inner",
	"data",
	"account_arguments",
	"tx_signer",
	"tx_success",
}

var expectedFilters = []IndexFilterEntity{
	{
		Column: "account_arguments",
		Predicates: []IndexFilterPredicate{
			{
				Type:  "lt",
				Value: []string{"4dv4puYib9XZXHrTN5csFxzfWKSmetTu1dLsJWNNV2XZ"},
			},
		},
	},
}

var jsonSample = `{
    "name": "Test name",
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
