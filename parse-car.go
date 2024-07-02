package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/allegro/bigcache/v3"
	"github.com/gagliardetto/solana-go"
	"github.com/ipfs/go-cid"
	carv2 "github.com/ipld/go-car/v2"
	hugecache "github.com/rpcpool/yellowstone-faithful/huge-cache"
	"github.com/rpcpool/yellowstone-faithful/ipld/ipldbindcode"
	splitcarfetcher "github.com/rpcpool/yellowstone-faithful/split-car-fetcher"
	"github.com/urfave/cli/v2"
	"github.com/ybbus/jsonrpc/v3"
	"time"
)

var ParseCarCmd = &cli.Command{
	Name:   "parse-car",
	Usage:  "Parses car file",
	After:  after,
	Action: ParseCar,
	Flags:  lassieFetchFlags,
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

	numItemsIndexed := uint64(0)

	dr, err := cr.DataReader()
	if err != nil {
		return "", fmt.Errorf("failed to get data reader: %w", err)
	}

	// Iterate over all Transactions in the CAR file and put them into the index,
	// using the transaction signature as the key and the CID as the value.
	err = FindTransactions(
		c.Context,
		dr,
		func(c cid.Cid, txNode *ipldbindcode.Transaction) error {
			fmt.Println("found tx")

			tx, meta, err := parseTransactionAndMetaFromNode(txNode, epoch.GetDataFrameByCid)

			encodedTx, encodedMeta, err := encodeTransactionResponseBasedOnWantedEncoding(solana.EncodingJSONParsed, tx, meta)
			if err != nil {
				return fmt.Errorf("failed to encode transaction response: %w", err)
			}
			fmt.Println("encodedTx: ", encodedTx)
			fmt.Println("encodedMeta: ", encodedMeta)

			jsonTx, err := json.Marshal(encodedTx)
			if err != nil {
				return fmt.Errorf("failed marshal tx: %w", err)
			}
			fmt.Println("encodedTx: ", string(jsonTx))
			jsonMeta, err := json.Marshal(encodedMeta)
			if err != nil {
				return fmt.Errorf("failed marshal meta: %w", err)
			}
			fmt.Println("encodedMeta: ", string(jsonMeta))

			_, err = readFirstSignature(txNode.Data.Bytes())
			if err != nil {
				return fmt.Errorf("failed to read signature: %w", err)
			}

			numItemsIndexed++
			if numItemsIndexed%100_000 == 0 {
				printToStderr(".")
			}
			return nil
		})
	if err != nil {
		return "", fmt.Errorf("failed to index; error while iterating over blocks: %w", err)
	}

	return "", nil
}
