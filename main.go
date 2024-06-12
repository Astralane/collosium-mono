package main

import (
	"log"
	"sync"
	"time"

	"github.com/astraline/astraline-filtering-service/pkg/database"
	"github.com/astraline/astraline-filtering-service/pkg/index_config"
	"github.com/astraline/astraline-filtering-service/pkg/job"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/segmentio/kafka-go"
)

// TODO: add ctrl+c hook to safely stop all jobs

type Config struct {
	dbDriver string
	dbConfig string

	kafkaAddr    string
	kafkaTopic   string
	kafkaGroupId string
	kafkaMaxWait time.Duration
}

const s = `{
    "version": "0.1.0",
    "name": "piggybank",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "piggyBank",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "deposit",
            "accounts": [
                {
                    "name": "piggyBank",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "withdraw",
            "accounts": [
                {
                    "name": "piggyBank",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "PiggyBank",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "amount",
                        "type": "u64"
                    }
                ]
            }
        }
    ]
}`

func main() {
	//var m interface{}
	//err := json.Unmarshal([]byte(s), &m)
	//if err != nil {
	//	panic(err)
	//}
	//
	//var k = m.(map[string]interface{})
	//var i = k["instructions"]
	//var ii = i.([]interface{})
	//for _, i1 := range ii {
	//
	//	var iii = i1.(map[string]interface{})
	//	fmt.Println(iii)
	//}

	wg := sync.WaitGroup{}
	cfg := Config{
		dbDriver: "postgres",
		dbConfig: "user=postgres dbname=postgres sslmode=disable password=postgres host=localhost",

		kafkaAddr:    "localhost:9092",
		kafkaTopic:   "geyser-to-workers",
		kafkaGroupId: "geyser-to-workers",
		kafkaMaxWait: time.Millisecond * 1,
	}

	kafkaCfg := kafka.ReaderConfig{
		Brokers:  []string{cfg.kafkaAddr},
		Topic:    cfg.kafkaTopic,
		GroupID:  cfg.kafkaGroupId,
		MinBytes: 1,    // 10B
		MaxBytes: 10e3, // 10KB
		MaxWait:  cfg.kafkaMaxWait,
	}

	// declare err variable here so DBConn won't be shadowed
	var err error
	database.Conn, err = sqlx.Connect(cfg.dbDriver, cfg.dbConfig)
	if err != nil {
		log.Fatal(err)
	}
	defer database.Conn.Close()

	// test db connection
	if err := database.Conn.Ping(); err != nil {
		log.Fatal(err)
	} else {
		log.Println("Successfully Connected")
	}

	wg.Add(2)
	w := job.New(kafkaCfg)
	jobQC := make(chan bool)
	go w.Start(jobQC, &wg)
	go index_config.Start(jobQC, &wg)

	wg.Wait()

}
