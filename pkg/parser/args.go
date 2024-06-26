package parser

import (
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/btcsuite/btcutil/base58"
)

func extractArgsValues(data []byte, args []interface{}, types []interface{}) map[string]interface{} {
	argsValues := make(map[string]interface{})
	offset := 0
	for _, arg := range args {
		argMap := arg.(map[string]interface{})
		argName := argMap["name"].(string)
		argType := argMap["type"]

		var n int
		argsValues[argName], n = extractValue(data, types, offset, argType)
		offset += n
	}
	return argsValues
}

func extractValue(data []byte, types []interface{}, offset int, argType interface{}) (interface{}, int) {
	pType, ok := argType.(string)
	if ok {
		return extractPrimitive(data, offset, pType)
	}

	npType, ok := argType.(map[string]interface{})
	if ok {
		return extractNonPrimitive(data, types, offset, npType)
	}

	return nil, 0
}

func extractPrimitive(data []byte, offset int, argType string) (interface{}, int) {
	switch argType {
	//TODO: add case for vec, object
	case "u64":
		if len(data[offset:]) < 8 {
			return nil, 8
		} else {
			return binary.LittleEndian.Uint64(data[offset : offset+8]), 8
		}
	case "u8":
		if len(data[offset:]) < 1 {
			return nil, 1
		} else {
			return data[offset], 1
		}
	case "bool":
		if len(data[offset:]) < 1 {
			return nil, 1
		} else {
			return data[offset], 1
		}
	case "publicKey":
		if len(data[offset:]) < 32 {
			return nil, 32
		} else {
			return base58.Encode(data[offset : offset+32]), 32
		}
	case "string":
		strLen := binary.LittleEndian.Uint32(data[offset : offset+4])
		var n int = 4
		if len(data[offset+n:]) < int(strLen) {
			return nil, n
		} else {
			return string(data[offset+n : offset+n+int(strLen)]), n + int(strLen)
		}
	}
	return nil, 0
}

func extractNonPrimitive(data []byte, types []interface{}, offset int, argType map[string]interface{}) (interface{}, int) {
	vec, ok := argType["vec"].(map[string]interface{})
	if ok {
		return extractVector(data, types, offset, vec)
	}
	arr, ok := argType["array"].([]interface{})
	if ok {
		return extractArray(data, types, offset, arr[0].(string), arr[1].(int))
	}
	obj, ok := argType["defined"].(string)
	if ok {
		return extractObject(data, types, offset, obj)
	}
	return nil, 0
}

// TODO: extract array
func extractVector(data []byte, types []interface{}, offset int, argType interface{}) (string, int) {
	res := make([]interface{}, 0)
	len := binary.LittleEndian.Uint32(data[offset : offset+4])
	var n int = 4
	for i := uint32(0); i < len; i++ {
		val, n_i := extractValue(data, types, int(offset)+n, argType)
		res = append(res, val)
		n += n_i
	}
	return fmt.Sprint(res), n
}

func extractArray(data []byte, types []interface{}, offset int, argType string, len int) ([]interface{}, int) {
	panic("not implemented")
}

func extractObject(data []byte, types []interface{}, offset int, typeName string) (string, int) {
	fields, err := extractNeccesaryFields(types, typeName)
	if err != nil {
		return "", 0
	}

	res := make(map[string]interface{})
	var n int = 0

	var n_i int
	for _, field := range fields {
		field, ok := field.(map[string]interface{})
		if !ok {
			log.Println("cannot cast field to map[string]interface{}, in extractObject")
		}
		res[field["name"].(string)], n_i = extractValue(data, types, offset+n, field["type"])
		n += n_i
	}

	json, err := json.Marshal(res)

	return string(json), n
}

func extractNeccesaryFields(types []interface{}, typeName string) ([]interface{}, error) {
	for _, t := range types {
		t, ok := t.(map[string]interface{})
		if !ok {
			return nil, errors.New("cannot cast type to map[string]interface{}")
		}
		if strings.EqualFold(t["name"].(string), typeName) {
			return t["type"].(map[string]interface{})["fields"].([]interface{}), nil
		}
	}
	return nil, errors.New(fmt.Sprintf("couldn't find type: %s, in: %+v", typeName, types))
}
