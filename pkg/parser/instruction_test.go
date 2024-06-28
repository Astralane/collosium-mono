package parser

import (
	"encoding/json"
	"fmt"
	"testing"
)

var dataSample = []byte{158, 246, 177, 28, 124, 97, 55, 174, 2, 0, 0, 0, 5, 0, 0, 0, 72, 111, 109, 101, 114, 24, 9, 0, 0, 0, 72, 111, 109, 101, 114, 105, 116, 116, 97, 20, 3, 0, 0, 0, 72, 105, 33, 3, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0}
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
      "name": "obj",
      "accounts": [],
      "args": [
        {
          "name": "info",
          "type": {
            "defined": "Info"
          }
        }
      ]
    },
    {
      "name": "primitives",
      "accounts": [],
      "args": [
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
        }
      ]
    },
    {
      "name": "vecs",
      "accounts": [],
      "args": [
        {
          "name": "familyMembers",
          "type": {
            "vec": {
              "defined": "FamilyData"
            }
          }
        },
        {
          "name": "favoriteBytes",
          "type": "bytes"
        },
        {
          "name": "favoriteNumbers",
          "type": {
            "vec": "u32"
          }
        }
      ]
    },
    {
      "name": "arrs",
      "accounts": [],
      "args": [
        {
          "name": "githubAccounts",
          "type": {
            "array": [
              {
                "defined": "GitHubInfo"
              },
              2
            ]
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
          },
          {
            "name": "location",
            "type": {
              "defined": "LocationInfo"
            }
          }
        ]
      }
    },
    {
      "name": "LocationInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "city",
            "type": "string"
          },
          {
            "name": "postalCode",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
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
    },
    {
      "name": "GitHubInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "repos",
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
