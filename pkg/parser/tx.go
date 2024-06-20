package parser

import (
	"github.com/btcsuite/btcutil/base58"
	"log"

	"github.com/segmentio/kafka-go"
	"google.golang.org/protobuf/proto"

	"github.com/astraline/astraline-filtering-service/protos-out"
)

type CustomInstructionColumn struct {
	name  string
	value string // todo make generic for any type of arguments
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

	additionalColumns []CustomInstructionColumn
}

func ProcessKafkaMsg(msg kafka.Message) {
	defer catchAndlogPanic("Panic during processing kafka message")

	txUpdate := &protos_out.TimestampedTransactionUpdate{}
	err := proto.Unmarshal(msg.Value, txUpdate)
	if err != nil {
		log.Printf("ERROR: cannot parse recieved transaction, skipping...")
		return
	}
	tx := txUpdate.Transaction

	message := tx.Tx.Transaction.Message
	meta := tx.Tx.Meta
	insts := message.Instructions
	if len(insts) == 0 {
		return
	}

	signature := base58.Encode(tx.Tx.Transaction.Signatures[0])

	accountKeys := parseAccountKeys(message.GetAccountKeys())

	for idx, ins := range insts {
		accounts := parseAccounts(ins.GetAccounts(), accountKeys)

		instData := InstructionData{
			slot:                  tx.GetSlot(),
			tx_id:                 signature,
			txIdx:                 tx.GetTxIdx(),
			accountKeys:           accountKeys,
			programId:             accountKeys[ins.GetProgramIdIndex()],
			isInner:               false,
			innerInstructionIndex: -1,
			outerInstructionIndex: int64(idx + 1),
			stackHeight:           1,
			accounts:              accounts,
			data:                  ins.GetData(),
			txSuccess:             len(meta.GetErr().GetErr()) == 0,
			txSigner:              accounts[0],
		}
		go processInstruction(instData)

		if len(meta.InnerInstructions) < idx {
			continue
		}

		innerInsts := meta.InnerInstructions[idx]
		for innerIdx, innerIns := range innerInsts.Instructions {
			accounts := parseAccounts(innerIns.GetAccounts(), accountKeys)

			instData := InstructionData{
				slot:                  tx.GetSlot(),
				tx_id:                 signature,
				txIdx:                 tx.GetTxIdx(),
				accountKeys:           accountKeys,
				programId:             accountKeys[innerIns.GetProgramIdIndex()],
				isInner:               true,
				innerInstructionIndex: int64(innerIdx + 1),
				outerInstructionIndex: int64(idx + 1),
				stackHeight:           innerIns.GetStackHeight(),
				accounts:              accounts,
				data:                  innerIns.GetData(),
				txSuccess:             len(meta.GetErr().GetErr()) == 0,
				txSigner:              accounts[0],
			}
			go processInstruction(instData)
		}
	}

}

func parseAccountKeys(accountKeys [][]byte) []string {
	result := make([]string, 0, len(accountKeys))
	for _, rowAccount := range accountKeys {
		result = append(result, base58.Encode(rowAccount))
	}
	return result
}

func parseAccounts(accounts []byte, accountKeys []string) []string {
	result := make([]string, 0, len(accounts))
	for _, accountIndex := range accounts {
		result = append(result, accountKeys[accountIndex])
	}
	return result
}

func catchAndlogPanic(message string) {
	panicValue := recover()
	if panicValue != nil {
		log.Printf("%s: %s", message, panicValue)
	}
}
