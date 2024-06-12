package main

import (
	"flag"
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

	flag.StringVar(&dbConfig.DBName, "db-name", "postgres", "postgres db name")
	flag.StringVar(&dbConfig.User, "db-username", "postgres", "postgres db username")
	flag.StringVar(&dbConfig.Password, "db-password", "postgres", "postgres db password")
	flag.StringVar(&dbConfig.Host, "db-host", "localhost", "postgres db host")
	flag.StringVar(&dbConfig.Port, "db-port", "5432", "postgres db port")
	flag.StringVar(&dbConfig.SslMode, "db-sslmode", "disable", "postgres db ssl mode")

	cfg = Config{
		dbDriver:     "postgres",
		kafkaMaxWait: 1 * time.Millisecond,
	}

	flag.StringVar(&cfg.kafkaAddr, "kafka-address", "localhost:9092", "")
	flag.StringVar(&cfg.kafkaTopic, "kafka-topic", "geyser-to-workers", "")
	flag.StringVar(&cfg.kafkaGroupId, "kafka-groupid", "geyser-to-workers", "")

	flag.Parse()

	// at that point all argumets are parsed
	// so we can put all structures to master struct (Config)
	// all fields in flag.<Type>Var() are taken by reference so
	// we should pass them to cfg (Config) either by reference or after flag.Parse()
	cfg.dbConfig = dbConfig
}

func main() {
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
		log.Printf("Failed to connect to db with config: %s", cfg.dbConfig.String())
		log.Fatal(err)
	}
	defer database.Conn.Close()

	// test db connection
	if err := database.Conn.Ping(); err != nil {
		log.Printf("Failed to ping db at %s:%s", cfg.dbConfig.Host, cfg.dbConfig.Port)
		log.Fatal(err)
	} else {
		log.Printf("Successfully connected to db at %s:%s", cfg.dbConfig.Host, cfg.dbConfig.Port)
	}

	wg.Add(2)
	w := job.New(kafkaCfg)
	jobQC := make(chan bool)
	go w.Start(jobQC, &wg)
	go index_config.Start(jobQC, &wg)

	wg.Wait()

}
