package parser

import (
	"encoding/json"
	"fmt"
	"testing"
)

var dataSample = []byte{68, 104, 189, 107, 223, 22, 248, 87, 3, 0, 0, 0, 106, 111, 101, 4, 0, 0, 0, 115, 97, 105, 107, 20, 1, 6, 0, 0, 0, 49, 50, 51, 49, 50, 51, 2, 0, 0, 0, 5, 0, 0, 0, 72, 111, 109, 101, 114, 24, 9, 0, 0, 0, 72, 111, 109, 101, 114, 105, 116, 116, 97, 20}
var programPubKey string = "4Sw3JdbtpW7xN9Rw4UbVY19o2v1LyoCvebnKPFu5fDr3"

var idlSample string = `{
  "version": "0.1.0",
  "name": "custom_struct_as_arg",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "dox",
      "accounts": [],
      "args": [
        {
          "name": "info",
          "type": {
            "defined": "Info"
          }
        },
        {
          "name": "age",
          "type": "u8"
        },
        {
          "name": "isHuman",
          "type": "bool"
        },
        {
          "name": "phoneNumber",
          "type": "string"
        },
        {
          "name": "familyMembers",
          "type": {
            "vec": {
              "defined": "FamilyData"
            }
          }
        }
      ]
    }
  ],
  "types": [
    {
      "name": "Info",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "surname",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "FamilyData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "age",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "metadata": {
    "address": "4Sw3JdbtpW7xN9Rw4UbVY19o2v1LyoCvebnKPFu5fDr3"
  }
}
`

func TestArgsParsing(t *testing.T) {
	var idl map[string]interface{}
	err := json.Unmarshal([]byte(idlSample), &idl)
	if err != nil {
		t.Fatal(err)
	}

	inst, err := getInstruction(dataSample, idl)
	if err != nil {
		t.Logf("%+v\n", idl)
		t.Fatal(err)
	}

	fmt.Printf("%+v\n", inst)
}
