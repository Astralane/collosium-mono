package parser

import (
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/btcsuite/btcutil/base58"

	"github.com/astraline/astraline-filtering-service/pkg/database"
	"github.com/astraline/astraline-filtering-service/pkg/utils"

	"github.com/astraline/astraline-filtering-service/pkg/index_config"

	_ "github.com/astraline/astraline-filtering-service/protos-out"
)

const getIdlQuery = "select idl from program_idl where program_pubkey = $1"

const dbDefault = ""

func processInstruction(instData InstructionData) {
	//log.Printf("processing instruction of transaction %s and pubkey: %s", instData.tx_id, instData.programId)
	indexConfigs := index_config.GlobalIndexConfig.Get()
	for _, indexConfig := range indexConfigs {
		go checkIndexAndInsert(instData, indexConfig)
	}
}

func checkIndexAndInsert(instData InstructionData, indexConfig index_config.IndexConfiguration) bool {
	result := true

	standardColumns := map[string]bool{
		"block_slot":              true,
		"signature":               true,
		"tx_id":                   true,
		"program_id":              true,
		"is_inner":                true,
		"inner_instruction_index": true,
		"outer_instruction_index": true,
		"stack_height":            true,
		"accounts":                true,
		"data":                    true,
		"tx_success":              true,
	}

	idl := maybeLoadIDL(instData.programId, indexConfig, standardColumns)

	for _, filter := range indexConfig.Filters {
		for _, predicate := range filter.Predicates {

			switch filter.Column {
			case "block_slot":
				result, _ = index_config.ApplyPredicate(predicate, []string{strconv.FormatUint(instData.slot, 10)})
			case "signature":
				result, _ = index_config.ApplyPredicate(predicate, []string{instData.tx_id})
			case "tx_id":
				result, _ = index_config.ApplyPredicate(predicate, []string{strconv.FormatUint(instData.txIdx, 10)})
			case "acount_keys":
				result, _ = index_config.ApplyPredicate(predicate, instData.accountKeys)
			case "program_id":
				result, _ = index_config.ApplyPredicate(predicate, []string{instData.programId})
			case "is_inner":
				result, _ = index_config.ApplyPredicate(predicate, []string{strconv.FormatBool(instData.isInner)})
			case "accounts":
				result, _ = index_config.ApplyPredicate(predicate, instData.accounts)
			case "data":
				// no-op, skip
			case "tx_success":
				result, _ = index_config.ApplyPredicate(predicate, []string{strconv.FormatBool(instData.txSuccess)})
			default:
				var err error
				result, err = applyWithIdl(instData, filter.Column, predicate, idl)
				if err != nil {
					log.Printf("ERROR: instruction not found\n")
					log.Print("idl: ")
					log.Println(idl)
					log.Printf("instData: %+v\n", instData)
				}
			}

			if !result {
				return false
			}
		}
	}

	saveToDB(instData, indexConfig)

	return result
}

func maybeLoadIDL(
	programPubkey string,
	indexConfig index_config.IndexConfiguration,
	standardColumns map[string]bool,
) map[string]interface{} {

	for _, filter := range indexConfig.Filters {
		if filter.Column == "program_id" {
			var idl, err = loadIDL(programPubkey)
			if err != nil {
				log.Printf("Failed to load idl for program:%s ,ERROR:%s", programPubkey, err)
			}
			return idl
		}
	}
	return nil
}

//type FetchedIndexCfg struct {
//	AccessKey  string `db:"access_key"`
//	JsonConfig []byte `db:"json_config"`
//}

func loadIDL(programPubkey string) (map[string]interface{}, error) {
	var data []byte
	err := database.Conn.Get(&data, getIdlQuery, programPubkey)
	if err != nil {
		return nil, err
		// TODO: fix it
		// panic(err)
	}

	var dynamicJsonData map[string]interface{}
	err = json.Unmarshal(data, &dynamicJsonData)
	if err != nil {
		return nil, errors.New("error parsing JSON")
	}
	return dynamicJsonData, nil
}

func applyWithIdl(
	instData InstructionData,
	column string,
	predicate index_config.IndexFilterPredicate,
	idl map[string]interface{},
) (bool, error) {
	if idl == nil {
		return false, nil
	}

	instruction, err := getInstruction(instData.data, idl)
	if err != nil {
		return false, err
	}

	if column == "instruction_name" {
		return index_config.ApplyPredicate(predicate, []string{instruction["name"].(string)})
	}

	if strings.HasPrefix(column, "account_") {
		accountColumn := strings.TrimPrefix(column, "account_")

		accounts := instruction["accounts"].([]interface{})
		accountIndex := -1
		for i, account := range accounts {
			accountMap := account.(map[string]interface{})
			accountParsed := accountMap["name"].(string)
			if accountColumn == accountParsed {
				accountIndex = i
				break
			}
		}

		if accountIndex >= 0 {
			return index_config.ApplyPredicate(predicate, []string{instData.accounts[accountIndex]})
		}
	}

	if strings.HasPrefix(column, "arg_") {
		argColumn := strings.TrimPrefix(column, "arg_")

		argsValues, ok := instruction["args_values"].(map[string]interface{})
		if ok {
			if argValue, exists := argsValues[argColumn]; exists {
				return index_config.ApplyPredicate(predicate, []string{fmt.Sprint(argValue)})
			}
		}
	}

	return false, nil
}

func getInstruction(data []byte, idl map[string]interface{}) (map[string]interface{}, error) {
	if idl == nil {
		return nil, errors.New("idl is nil")
	}
	if data == nil {
		return nil, errors.New("data is nil")
	}

	instructions, ok := idl["instructions"].([]interface{})
	if !ok {
		return nil, errors.New("instructions not found in IDL")
	}

	for _, instruction := range instructions {
		instructionMap, ok := instruction.(map[string]interface{})
		if !ok {
			continue
		}
		if discriminator, ok := instructionMap["discriminator"].([]interface{}); ok {
			if len(discriminator) == 4 {
				discriminatorBytes := make([]byte, 4)
				for i, val := range discriminator {
					discriminatorBytes[i] = byte(val.(float64))
				}

				if bytes.Equal(data[:4], discriminatorBytes) {
					argsValues := extractArgsValues(data[4:], instructionMap["args"].([]interface{}))
					instructionMap["args_values"] = argsValues
					return instructionMap, nil
				}
			}
		} else {
			instructionName, ok := instructionMap["name"].(string)
			if !ok {
				continue
			}
			instructionName = utils.ToSnakeCase(instructionName)
			hash := sha256.Sum256([]byte(fmt.Sprintf("global:%s", instructionName)))

			if bytes.Equal(data[:8], hash[:8]) {
				instructionMap["args_values"] = extractArgsValues(data[8:], instructionMap["args"].([]interface{}))
				return instructionMap, nil
			}
		}
	}

	return nil, errors.New("can't find instruction")
}

func saveToDB(instData InstructionData, indexConfig index_config.IndexConfiguration) {
	query := constructQuery(indexConfig)
	executeQuery(query, instData, indexConfig.Columns)
}

func constructQuery(indexConfig index_config.IndexConfiguration) string {
	var columnsConcat bytes.Buffer
	var valuesPlaceHolderConcat bytes.Buffer
	for i, c := range indexConfig.Columns {
		columnsConcat.WriteString(c + ", ")
		valuesPlaceHolderConcat.WriteString(fmt.Sprintf("$%d, ", i+1))
	}
	// remove last ', '
	if columnsConcat.Len() > len(", ") {
		columnsConcat.Truncate(columnsConcat.Len() - len(", "))
	}
	if valuesPlaceHolderConcat.Len() > len(", ") {
		valuesPlaceHolderConcat.Truncate(valuesPlaceHolderConcat.Len() - len(", "))
	}

	q := fmt.Sprintf("insert into %s (%s) values (%s)",
		indexConfig.TableName,
		columnsConcat.String(),
		valuesPlaceHolderConcat.String())
	return q
}

func executeQuery(query string, data InstructionData, columns []string) {
	params := make([]interface{}, 0, len(columns))
	// paramsMap := map[string]interface{}{}
	idl, err := loadIDL(data.programId)
	if err != nil {
		log.Printf("idl couldn't be loaded, err:%s\n", err)
		idl = nil
	}
	parsedData, err := getInstruction(data.data, idl)
	if err != nil {
		log.Printf("parsedData couldn't be loaded, err:%s\n", err)
		parsedData = nil
	}

	for _, c := range columns {
		switch c {
		case "block_slot":
			params = append(params, data.slot)
		case "tx_id":
			params = append(params, data.tx_id)
		case "tx_index":
			params = append(params, data.txIdx)
		case "account_keys":
			params = append(params, data.accountKeys)
		case "program_id":
			params = append(params, data.programId)
		case "is_inner":
			params = append(params, data.isInner)
		case "inner_instruction_index":
			idx := data.innerInstructionIndex
			if idx == -1 {
				params = append(params, nil)
			} else {
				params = append(params, idx)
			}
		case "outer_instruction_index":
			params = append(params, data.outerInstructionIndex)
		case "stack_height":
			params = append(params, data.stackHeight)
		case "accounts":
			params = append(params, data.accounts)
		case "data":
			params = append(params, base58.Encode(data.data))
		case "tx_success":
			params = append(params, data.txSuccess)
		case "tx_signer":
			params = append(params, data.txSigner)
		case "instruction_name":
			params = append(params, getInstructionName(parsedData))
		default:
			params = append(params, matchColumnWithPattern(c, data, parsedData, idl))
		}
	}
	// _, err := database.Conn.Exec(query, data.slot, data.txIdx, data.programId, base58.Encode(data.data), data.txSigner, data.txSuccess)
	_, err = database.Conn.Exec(query, params...)
	if err != nil {
		log.Printf("ERROR couldn't save data to index. Err: %s\n", err)
		log.Printf("DATA: %+v", data)
		return
	}
}

func getInstructionName(data map[string]any) any {
	if data == nil {
		return dbDefault
	}
	return data["name"]
}

func matchColumnWithPattern(c string,
	data InstructionData,
	parsedData map[string]any,
	idl map[string]any) any {
	if parsedData == nil || idl == nil {
		return dbDefault
	}

	switch getPrefix(c) {
	case "account_":
		return getAccountPubKey(strings.TrimPrefix(c, "account_"), parsedData, data.accounts)
	case "arg_":
		return getArgumentValue(strings.TrimPrefix(c, "arg_"), parsedData)
	default:
		return dbDefault
	}
}

func getAccountPubKey(accountName string, pd map[string]any, rcvdAccounts []string) any {
	accounts := pd["accounts"].([]interface{})
	accountIndex := -1
	for i, account := range accounts {
		accountMap := account.(map[string]interface{})
		accountParsed := accountMap["name"].(string)
		if strings.ToLower(accountName) == strings.ToLower(accountParsed) {
			accountIndex = i
			break
		}
	}

	if accountIndex >= 0 {
		return rcvdAccounts[accountIndex]
	}
	return dbDefault
}

func getPrefix(c string) string {
	if strings.HasPrefix(c, "account_") {
		return "account_"
	}
	if strings.HasPrefix(c, "arg_") {
		return "arg_"
	}
	return ""
}

func getArgumentValue(argName string, parsedData map[string]interface{}) interface{} {
	argsValues, ok := parsedData["args_values"].(map[string]interface{})
	if !ok {
		return dbDefault
	}

	if value, exists := argsValues[argName]; exists {
		return value
	}

	return dbDefault
}

func extractArgsValues(data []byte, args []interface{}) map[string]interface{} {
	argsValues := make(map[string]interface{})
	offset := 0
	for _, arg := range args {
		argMap := arg.(map[string]interface{})
		argName := argMap["name"].(string)
		argType := argMap["type"].(string)

		switch argType {
		case "u64":
			if len(data[offset:]) < 8 {
				argsValues[argName] = nil
			} else {
				argsValues[argName] = binary.LittleEndian.Uint64(data[offset : offset+8])
				offset += 8
			}
		case "publicKey":
			if len(data[offset:]) < 32 {
				argsValues[argName] = nil
			} else {
				argsValues[argName] = base58.Encode(data[offset : offset+32])
				offset += 32
			}
		case "string":
			strLen := binary.LittleEndian.Uint64(data[offset : offset+8])
			offset += 8
			if len(data[offset:]) < int(strLen) {
				argsValues[argName] = nil
			} else {
				argsValues[argName] = string(data[offset : offset+int(strLen)])
				offset += int(strLen)
			}
		}
	}
	return argsValues
}
