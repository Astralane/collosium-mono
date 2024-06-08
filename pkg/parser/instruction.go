package parser

import (
	"bytes"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/btcsuite/btcutil/base58"
	"log"
	"strconv"
	"strings"

	"github.com/astraline/astraline-filtering-service/pkg/database"

	"github.com/astraline/astraline-filtering-service/pkg/index_config"

	_ "github.com/astraline/astraline-filtering-service/protos-out"
)

const getIdlQuery = "select idl from program_idl where program_pubkey = $1"

func processInstruction(instData InstructionData) {
	// TODO: filter data
	// TODO: populate db with that data

	println("processing instruction of transaction " + instData.sig + " and pubkey: " + instData.programId)
	indexConfigs := index_config.GlobalIndexConfig.Get()
	for _, indexConfig := range indexConfigs {
		go checkIndexAndInsert(instData, indexConfig)
	}
}

func checkIndexAndInsert(instData InstructionData, indexConfig index_config.IndexConfiguration) bool {
	result := true

	standardColumns := map[string]bool{
		"block_slot": true,
		"signature":  true,
		"tx_id":      true,
		"program_id": true,
		"is_inner":   true,
		"accounts":   true,
		"data":       true,
		"tx_success": true,
	}

	idl := maybeLoadIDL(instData.programId, indexConfig, standardColumns)

	for _, filter := range indexConfig.Filters {
		for _, predicate := range filter.Predicates {

			switch filter.Column {
			case "block_slot":
				result, _ = index_config.ApplyPredicate(predicate, []string{strconv.FormatUint(instData.slot, 10)})
			case "signature":
				result, _ = index_config.ApplyPredicate(predicate, []string{instData.sig})
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
				result, _ = applyWithIdl(instData, filter.Column, predicate, idl)
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
			var idl, _ = loadIDL(programPubkey)
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
	println("loading idl for pubkey " + programPubkey)
	var data []byte
	err := database.Conn.Get(&data, getIdlQuery, programPubkey)
	if err != nil {
		panic(err)
	}
	var dataString string
	err = json.Unmarshal(data, &dataString)
	if err != nil {
		fmt.Println("Error parsing JSON string:", err)
		return nil, errors.New("error parsing JSON")
	}

	var dynamicJsonData map[string]interface{}
	err = json.Unmarshal([]byte(dataString), &dynamicJsonData)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
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

	instruction, _ := getInstruction(instData.data, idl)

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

	return false, nil
}

func getInstruction(data []byte, idl map[string]interface{}) (map[string]interface{}, error) {
	instructions := idl["instructions"].([]interface{})
	for _, instruction := range instructions {
		instructionMap := instruction.(map[string]interface{})
		instructionName := instructionMap["name"].(string)
		hash := sha256.Sum256([]byte(fmt.Sprintf("global:%s", instructionName)))
		if bytes.Equal(data[:8], hash[:8]) {
			return instructionMap, nil
		}
	}

	return nil, errors.New("Can't find instruction")
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
	log.Printf("trying to save data to index, query: %s\n", query)
	//params := make([]interface{}, 0, len(columns))
	//paramsMap := map[string]interface{}{}
	//for _, c := range columns {
	//	switch c {
	//	case "block_slot":
	//		paramsMap[c] = data.slot
	//	case "signature":
	//		paramsMap[c] = data.sig
	//	case "tx_id":
	//		paramsMap[c] = data.txIdx
	//	case "account_keys":
	//		paramsMap[c] = data.accountKeys
	//	case "program_id":
	//		paramsMap[c] = data.programId
	//	case "is_inner":
	//		paramsMap[c] = data.isInner
	//	case "accounts":
	//		paramsMap[c] = data.accounts
	//	case "data":
	//		paramsMap[c] = data.data
	//	case "tx_success":
	//		paramsMap[c] = data.txSuccess
	//	case "tx_signer":
	//		paramsMap[c] = data.txSigner
	//	default:
	//		// TODO: add idl return handling
	//	}
	//}
	_, err := database.Conn.Exec(query, data.slot, data.sig, data.programId, base58.Encode(data.data), data.txSigner, data.txSuccess)
	if err != nil {
		log.Printf("ERROR couldn't save data to index. Err: %s\n", err)
		return
	}
	log.Println("saved data to index db")
}

func getDataByColumnName(data InstructionData, cName string) any {

	return ""
}
