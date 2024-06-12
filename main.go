package main

import (
	"flag"
	"fmt"
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
	dbConfig database.DBConfig

	kafkaAddr    string
	kafkaTopic   string
	kafkaGroupId string
	kafkaMaxWait time.Duration
}

var cfg Config

// parse flags here
func init() {
	dbConfig := database.DBConfig{}

	flag.StringVar(&dbConfig.DBName, "db-name", "postgres", "TODO")
	flag.StringVar(&dbConfig.User, "db-username", "postgres", "TODO")
	flag.StringVar(&dbConfig.Password, "db-password", "postgres", "TODO")
	flag.StringVar(&dbConfig.Host, "db-host", "localhost", "TODO")
	flag.StringVar(&dbConfig.SslMode, "db-sslmode", "disable", "TODO")

	cfg = Config{
		dbDriver:     "postgres",
		kafkaMaxWait: 1 * time.Millisecond,
	}

	flag.StringVar(&cfg.kafkaAddr, "kafka-address", "localhost:9092", "TODO")
	flag.StringVar(&cfg.kafkaTopic, "kafka-topic", "geyser-to-workers", "TODO")
	flag.StringVar(&cfg.kafkaGroupId, "kafka-groupid", "geyser-to-workers", "TODO")

	flag.Parse()

	// at that poing all argumets are parsed
	// so we can put all structures to master struct (Config)
	// all fields in flag.<Type>Var() are taken by reference so
	// we should pass them to cfg (Config) either by reference or after flag.Parse()
	cfg.dbConfig = dbConfig
}

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
	database.Conn, err = sqlx.Connect(cfg.dbDriver, cfg.dbConfig.String())
	if err != nil {
		log.Println(cfg.dbConfig.String())
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
