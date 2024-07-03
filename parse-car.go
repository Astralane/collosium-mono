package main

import (
	"context"
	"fmt"
	"time"

	"github.com/allegro/bigcache/v3"
	"github.com/gagliardetto/solana-go"
	"github.com/ipfs/go-cid"
	carv2 "github.com/ipld/go-car/v2"
	"github.com/mr-tron/base58"
	hugecache "github.com/rpcpool/yellowstone-faithful/huge-cache"
	"github.com/rpcpool/yellowstone-faithful/ipld/ipldbindcode"
	metalatest "github.com/rpcpool/yellowstone-faithful/parse_legacy_transaction_status_meta/v-latest"
	metaoldest "github.com/rpcpool/yellowstone-faithful/parse_legacy_transaction_status_meta/v-oldest"
	splitcarfetcher "github.com/rpcpool/yellowstone-faithful/split-car-fetcher"
	"github.com/rpcpool/yellowstone-faithful/third_party/solana_proto/confirmed_block"
	"github.com/urfave/cli/v2"
	"github.com/ybbus/jsonrpc/v3"
)

var ParseCarCmd = &cli.Command{
	Name:   "parse-car",
	Usage:  "Parses car file",
	After:  after,
	Action: ParseCar,
	Flags:  lassieFetchFlags,
}

type InstructionData struct {
	slot                  uint64
	tx_id                 string
	txIdx                 uint64
	accountKeys           []string
	programId             string
	isInner               bool
	outerInstructionIndex int64
	innerInstructionIndex int64
	stackHeight           uint32
	accounts              []string
	data                  []byte
	txSuccess             bool
	txSigner              string
}

func ParseCar(c *cli.Context) error {
	_, err := parseIndex(c)
	if err != nil {
		fmt.Printf("Error: %s", err)
		return err
	}

	return nil
}

func parseIndex(
	c *cli.Context,
) (string, error) {

	carPath := c.Args().Get(0)
	epochConfigPath := c.Args().Get(1)

	// Check if the CAR file exists:
	exists, err := fileExists(carPath)
	if err != nil {
		return "", fmt.Errorf("failed to check if CAR file exists: %w", err)
	}
	if !exists {
		return "", fmt.Errorf("CAR file %q does not exist", carPath)
	}

	cr, err := carv2.OpenReader(carPath)
	if err != nil {
		return "", fmt.Errorf("failed to open CAR file: %w", err)
	}

	// check it has 1 root
	roots, err := cr.Roots()
	if err != nil {
		return "", fmt.Errorf("failed to get roots: %w", err)
	}
	// There should be only one root CID in the CAR file.
	if len(roots) != 1 {
		return "", fmt.Errorf("CAR file has %d roots, expected 1", len(roots))
	}

	conf := bigcache.DefaultConfig(5 * time.Minute)
	allCache, err := hugecache.NewWithConfig(context.TODO(), conf)
	lotusAPIAddress := "https://api.node.glif.io"
	cl := jsonrpc.NewClient(lotusAPIAddress)
	minerInfo := splitcarfetcher.NewMinerInfo(
		cl,
		24*time.Hour,
		5*time.Second,
	)

	config, err := LoadConfig(epochConfigPath)

	epoch, err := NewEpochFromConfig(
		config,
		c,
		allCache,
		minerInfo,
	)

	// numItemsIndexed := uint64(0)

	dr, err := cr.DataReader()
	if err != nil {
		return "", fmt.Errorf("failed to get data reader: %w", err)
	}

	var instCount uint64 = 0

	// Iterate over all Transactions in the CAR file and put them into the index,
	// using the transaction signature as the key and the CID as the value.
	err = FindTransactions(
		c.Context,
		dr,
		func(c cid.Cid, txNode *ipldbindcode.Transaction) error {
			fmt.Println("found tx")

			tx, meta, err := parseTransactionAndMetaFromNode(txNode, epoch.GetDataFrameByCid)
			if err != nil {
				return err
			}

			instructions := ParseTx(tx, meta, uint64(txNode.Slot), uint64(**txNode.Index))

			instCount += uint64(len(instructions))

			// encodedTx, encodedMeta, err := encodeTransactionResponseBasedOnWantedEncoding(solana.EncodingJSONParsed, tx, meta)
			// if err != nil {
			// 	return fmt.Errorf("failed to encode transaction response: %w", err)
			// }
			// fmt.Println("encodedTx: ", encodedTx)
			// fmt.Println("encodedMeta: ", encodedMeta)
			//
			// jsonTx, err := json.Marshal(encodedTx)
			// if err != nil {
			// 	return fmt.Errorf("failed marshal tx: %w", err)
			// }
			// fmt.Println("encodedTx: ", string(jsonTx))
			// jsonMeta, err := json.Marshal(encodedMeta)
			// if err != nil {
			// 	return fmt.Errorf("failed marshal meta: %w", err)
			// }
			// fmt.Println("encodedMeta: ", string(jsonMeta))
			//
			// _, err = readFirstSignature(txNode.Data.Bytes())
			// if err != nil {
			// 	return fmt.Errorf("failed to read signature: %w", err)
			// }
			//
			// numItemsIndexed++
			// if numItemsIndexed%100_000 == 0 {
			// 	printToStderr(".")
			// }
			// return nil
			return nil
		})
	if err != nil {
		return "", fmt.Errorf("UwU:failed to index; error while iterating over blocks: %w", err)
	}

	return "", nil
}

type InnerInstructions struct {
	accounts       []byte
	programIdIndex uint32
	stackHeight    uint32
	data           []byte
}

type AccountIdxType interface {
	byte | uint16
}

func ParseTx(tx solana.Transaction, metaAny any, slot, index uint64) []InstructionData {

	// err innerinstructions
	var txSuccess bool
	innerInstructions := make([][]InnerInstructions, 0)
	lutTables := make([]string, 0)

	// try to parse as protobuf (latest format)
	// *confirmed_block.TransactionStatusMeta
	metaLatestConfirmed, ok := metaAny.(*confirmed_block.TransactionStatusMeta)
	if ok {
		txSuccess = (len(metaLatestConfirmed.Err.GetErr()) == 0)

		for _, acc := range metaLatestConfirmed.GetLoadedWritableAddresses() {
			lutTables = append(lutTables, string(acc))
		}

		for _, acc := range metaLatestConfirmed.GetLoadedReadonlyAddresses() {
			lutTables = append(lutTables, string(acc))
		}

		ii := metaLatestConfirmed.GetInnerInstructions()
		// ii - inner instructions
		// i - instructinos
		// i_i - instrucions[i]
		// sorry for confusion tho
		for _, i := range ii {
			innerInstructions_i := make([]InnerInstructions, 0)
			for _, i_i := range i.Instructions {
				innerInstructions_i_j := InnerInstructions{
					accounts:       i_i.GetAccounts(),
					programIdIndex: i_i.GetProgramIdIndex(),
					stackHeight:    i_i.GetStackHeight(),
					data:           i_i.GetData(),
				}
				innerInstructions_i = append(innerInstructions_i, innerInstructions_i_j)
			}
			innerInstructions = append(innerInstructions, innerInstructions_i)
		}
	}

	// try to parse as legacy serde format (last serde format used by solana)
	// *metalatest.TransactionStatusMeta
	metaLatest, ok := metaAny.(*metalatest.TransactionStatusMeta)
	if ok {
		status, _ := metaLatest.Status.BincodeSerialize()
		txSuccess = (len(status) == 0)
		innerInstructions = make([][]InnerInstructions, 0)
	}

	// try to parse as legacy serde format (probably the oldest serde format used by solana)
	// *metaoldest.TransactionStatusMeta
	metaOldest, ok := metaAny.(*metaoldest.TransactionStatusMeta)
	if ok {
		status, _ := metaOldest.Status.BincodeSerialize()
		txSuccess = (len(status) == 0)
		innerInstructions = make([][]InnerInstructions, 0)
	}

	ret := make([]InstructionData, 0)

	message := tx.Message
	insts := message.Instructions
	if len(insts) == 0 {
		return nil
	}

	signature := tx.Signatures[0].String()

	accountKeys := parseAccountKeys(message.AccountKeys)
	accountKeys = append(accountKeys, lutTables...)

	for idx, ins := range insts {
		accounts := parseAccounts(ins.Accounts, accountKeys)

		instData := InstructionData{
			//TODO: make it automatic
			slot:                  slot,
			tx_id:                 signature,
			txIdx:                 index,
			accountKeys:           accountKeys,
			programId:             accountKeys[ins.ProgramIDIndex],
			isInner:               false,
			innerInstructionIndex: -1,
			outerInstructionIndex: int64(idx + 1),
			stackHeight:           1,
			accounts:              accounts,
			data:                  ins.Data,
			txSuccess:             txSuccess,
			txSigner:              accountKeys[0],
		}
		ret = append(ret, instData)

		if len(innerInstructions) <= idx {
			continue
		}

		innerInsts := innerInstructions[idx]
		for innerIdx, innerIns := range innerInsts {
			accounts := parseAccounts(innerIns.accounts, accountKeys)

			if len(accountKeys) <= int(innerIns.programIdIndex) {
				continue
			}

			instData := InstructionData{
				slot:                  slot,
				tx_id:                 signature,
				txIdx:                 index,
				accountKeys:           accountKeys,
				programId:             accountKeys[innerIns.programIdIndex],
				isInner:               true,
				innerInstructionIndex: int64(innerIdx + 1),
				outerInstructionIndex: int64(idx + 1),
				stackHeight:           innerIns.stackHeight,
				accounts:              accounts,
				data:                  innerIns.data,
				txSuccess:             txSuccess,
				txSigner:              accountKeys[0],
			}
			ret = append(ret, instData)
		}
	}
	return nil
}

func parseAccountKeys(accountKeys []solana.PublicKey) []string {
	result := make([]string, 0, len(accountKeys))
	for _, rowAccount := range accountKeys {
		result = append(result, base58.Encode(rowAccount.Bytes()))
	}
	return result
}

func parseAccounts[AccType AccountIdxType](accounts []AccType, accountKeys []string) []string {
	result := make([]string, 0, len(accounts))
	for _, accountIndex := range accounts {
		if int(accountIndex) >= len(accountKeys) {
			fmt.Println("index:")
			fmt.Println(accountIndex)
			fmt.Println("accounts:")
			fmt.Println(accounts)
			fmt.Println("keys:")
			fmt.Println(accountKeys)
			continue
		}
		result = append(result, accountKeys[accountIndex])
	}
	return result
}
