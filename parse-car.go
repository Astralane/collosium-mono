package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net"
	"os"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2/lib/driver"
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
	Slot                  uint64   `json:"slot"`
	Tx_id                 string   `json:"txId"`
	TxIdx                 uint64   `json:"txIndex"`
	AccountKeys           []string `json:"accountKeys"`
	ProgramId             string   `json:"programId"`
	IsInner               bool     `json:"isInner"`
	OuterInstructionIndex int64    `json:"outerInstructionIndex"`
	InnerInstructionIndex int64    `json:"innerInstructionIndex"`
	StackHeight           uint32   `json:"stackHeight"`
	Accounts              []string `json:"accounts"`
	Data                  []byte   `json:"data"`
	TxSuccess             bool     `json:"txSuccess"`
	TxSigner              string   `json:"txSigner"`
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
	var txCount uint64 = 0
	var instsSinceLastIns uint64 = 0
	batch, conn, err := CreateBatch()
	if err != nil {
		panic(err)
	}

	// Iterate over all Transactions in the CAR file and put them into the index,
	// using the transaction signature as the key and the CID as the value.
	err = FindTransactions(
		c.Context,
		dr,
		func(c cid.Cid, txNode *ipldbindcode.Transaction) error {

			tx, meta, err := parseTransactionAndMetaFromNode(txNode, epoch.GetDataFrameByCid)
			if err != nil {
				return err
			}

			instructions := ParseTx(tx, meta, uint64(txNode.Slot), uint64(**txNode.Index))
			for _, inst := range instructions {
				p, _ := json.Marshal(inst)
				fmt.Printf("%s\n\n", string(p))

				// err := batch.Append(
				// 	inst.ProgramId,
				// 	inst.Slot,
				// 	inst.Tx_id,
				// 	inst.TxIdx,
				// 	inst.AccountKeys,
				// 	inst.IsInner,
				// 	inst.OuterInstructionIndex,
				// 	inst.InnerInstructionIndex,
				// 	inst.StackHeight,
				// 	inst.Accounts,
				// 	inst.Data,
				// 	inst.TxSuccess,
				// 	inst.TxSigner,
				// )
				// if err != nil {
				// 	return nil
				// }
			}

			instCount += uint64(len(instructions))
			txCount++
			instsSinceLastIns += uint64(len(instructions))
			fmt.Fprintf(os.Stderr, "\rparsed %d instructions within %d transactions", instCount, txCount)
			if instsSinceLastIns >= 80000 {
				batch = SendBatch(conn, batch)
				instsSinceLastIns = 0
			}
			//5425613
			if txCount >= 10000000 {
				panic("done")
			}

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
			Slot:                  slot,
			Tx_id:                 signature,
			TxIdx:                 index,
			AccountKeys:           accountKeys,
			ProgramId:             accountKeys[ins.ProgramIDIndex],
			IsInner:               false,
			InnerInstructionIndex: -1,
			OuterInstructionIndex: int64(idx + 1),
			StackHeight:           1,
			Accounts:              accounts,
			Data:                  ins.Data,
			TxSuccess:             txSuccess,
			TxSigner:              accountKeys[0],
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
				Slot:                  slot,
				Tx_id:                 signature,
				TxIdx:                 index,
				AccountKeys:           accountKeys,
				ProgramId:             accountKeys[innerIns.programIdIndex],
				IsInner:               true,
				InnerInstructionIndex: int64(innerIdx + 1),
				OuterInstructionIndex: int64(idx + 1),
				StackHeight:           innerIns.stackHeight,
				Accounts:              accounts,
				Data:                  innerIns.data,
				TxSuccess:             txSuccess,
				TxSigner:              accountKeys[0],
			}
			ret = append(ret, instData)
		}
	}
	return ret
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
		result = append(result, accountKeys[accountIndex])
	}
	return result
}

func CreateBatch() (driver.Batch, driver.Conn, error) {
	conn, err := connect()
	if err != nil {
		panic(err)
	}
	ctx := context.Background()
	conn.Exec(context.Background(), "DROP TABLE IF EXISTS instructions")
	err = conn.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS instructions (
	programId             String,
	slot                  UInt64,
	tx_id                 String,
	txIdx                 UInt64,
	accountKeys           Array(String),
	isInner               Bool,
	outerInstructionIndex Int64,
	innerInstructionIndex Int64,
	stackHeight           UInt32,
	accounts              Array(String),
	data                  Array(UInt8),
	txSuccess             Bool,
	txSigner              String
		) 
	ENGINE = MergeTree
	PRIMARY KEY (programId)
	ORDER BY (programId, slot)
	`)

	if err != nil {
		return nil, nil, err
	}

	batch, err := conn.PrepareBatch(ctx, "INSERT INTO instructions")
	if err != nil {
		return nil, nil, err
	}
	return batch, conn, nil
}

func SendBatch(conn driver.Conn, batch driver.Batch) driver.Batch {
	go batch.Send()
	batch, err := conn.PrepareBatch(context.Background(), "INSERT INTO instructions")
	if err != nil {
		return nil
	}
	return batch
}

func connect() (driver.Conn, error) {
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{"127.0.0.1:9000"},
		Auth: clickhouse.Auth{
			Database: "default",
			Username: "default",
			Password: "",
		},
		DialContext: func(ctx context.Context, addr string) (net.Conn, error) {
			var d net.Dialer
			return d.DialContext(ctx, "tcp", addr)
		},
		Debug: true,
		Debugf: func(format string, v ...any) {
			//fmt.Printf(format+"\n", v...)
		},
		Settings: clickhouse.Settings{
			"max_execution_time": 60,
		},
		Compression: &clickhouse.Compression{
			Method: clickhouse.CompressionLZ4,
		},
		DialTimeout:          time.Second * 30,
		MaxOpenConns:         5,
		MaxIdleConns:         5,
		ConnMaxLifetime:      time.Duration(10) * time.Minute,
		ConnOpenStrategy:     clickhouse.ConnOpenInOrder,
		BlockBufferSize:      10,
		MaxCompressionBuffer: 10240,
		ClientInfo: clickhouse.ClientInfo{ // optional, please see Client info section in the README.md
			Products: []struct {
				Name    string
				Version string
			}{
				{Name: "my-app", Version: "0.1"},
			},
		},
	})
	if err != nil {
		return nil, err
	}
	err = conn.Ping(context.Background())
	return conn, err
}
