package index_config

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/astraline/astraline-filtering-service/pkg/database"
)

const getCfgsQuery = "SELECT index_id, json_config FROM index_configuration"

type FetchedIndexCfg struct {
	AccessKey  string `db:"index_id"`
	JsonConfig []byte `db:"json_config"`
}

func Start(q chan bool, wg *sync.WaitGroup) {
	defer wg.Done()
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-q:
			return
		case <-ticker.C:
			syncWithDB()
		}
	}
}

func syncWithDB() {
	// Query the database
	var rows []FetchedIndexCfg
	err := database.Conn.Select(&rows, getCfgsQuery)
	if err != nil {
		log.Fatal(err)
	}

	indexConfig := make([]IndexConfiguration, 0, len(rows))
	for _, row := range rows {
		parsed := parseJsonCfg(row.JsonConfig)
		indexConfig = append(indexConfig, parsed)
		//
		//var parsedConfig FetchedIndexCfg
		//err := json.Unmarshal(row.jsonConfig, &parsedConfig)
		//if err != nil {
		//	log.Printf("Failed to unmarshal JSONB data for row %d: %v\n", row.jsonConfig, err)
		//	continue
		//}
		//parsedConfigs = append(parsedConfigs, parsedConfig)
	}

	//resp := []FetchedIndexCfg{}
	//err := database.Conn.Get(&resp, getCfgsQuery)
	//if err != nil {
	//	log.Fatalf("cannot read index configuration, ERROR: %s", err.Error())
	//}
	//
	//
	//for _, fetchedIndexCfg := range resp {
	//	parsed := parseJsonCfg(fetchedIndexCfg.JsonConfig)
	//}

	GlobalIndexConfig.Update(indexConfig)
}

func parseJsonCfg(config []byte) IndexConfiguration {
	var parsedToString string
	err := json.Unmarshal(config, &parsedToString)
	if err != nil {
		log.Fatalf("cannot parse index configuration to string, ERROR: %s", err.Error())
	}

	var parsedToStruct IndexConfiguration
	err = json.Unmarshal([]byte(parsedToString), &parsedToStruct)
	if err != nil {
		log.Fatalf("cannot parse index configuration, ERROR: %s", err.Error())
	}
	return parsedToStruct
}
