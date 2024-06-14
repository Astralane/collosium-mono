package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
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

	httpPort string
}

var cfg Config

// parse flags here
func init() {
	dbConfig := database.DBConfig{}

	flag.StringVar(&dbConfig.DBName, "db-name", getenv("DB_NAME", "postgres"),
		"postgres db name")
	flag.StringVar(&dbConfig.User, "db-username", getenv("DB_USERNAME", "postgres"),
		"postgres db username")
	flag.StringVar(&dbConfig.Password, "db-password", getenv("DB_PASSWORD", "postgres"),
		"postgres db password")
	flag.StringVar(&dbConfig.Host, "db-host", getenv("DB_HOST", "localhost"),
		"postgres db host")
	flag.StringVar(&dbConfig.Port, "db-port", getenv("DB_PORT", "5432"),
		"postgres db port")
	flag.StringVar(&dbConfig.SslMode, "db-sslmode", getenv("DB_SSLMODE", "disable"),
		"postgres db ssl mode")

	cfg = Config{
		dbDriver:     "postgres",
		kafkaMaxWait: 1 * time.Millisecond,
	}

	flag.StringVar(&cfg.kafkaAddr, "kafka-address", getenv("KAFKA_ADDRESS", "localhost:9092"), "")
	flag.StringVar(&cfg.kafkaTopic, "kafka-topic", getenv("KAFKA_TOPIC", "geyser-to-workers"), "")
	flag.StringVar(&cfg.kafkaGroupId, "kafka-groupid", getenv("KAFKA_GROUPID", "geyser-to-workers"), "")

	flag.StringVar(&cfg.httpPort, "http-port", getenv("HTTP_PORT", "8079"), "http port")

	flag.Parse()

	// at that point all argumets are parsed
	// so we can put all structures to master struct (Config)
	// all fields in flag.<Type>Var() are taken by reference so
	// we should pass them to cfg (Config) either by reference or after flag.Parse()
	cfg.dbConfig = dbConfig
}

func getenv(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

func main() {
	wg := sync.WaitGroup{}

	kafkaCfg := kafka.ReaderConfig{
		Brokers:          []string{cfg.kafkaAddr},
		Topic:            cfg.kafkaTopic,
		GroupID:          cfg.kafkaGroupId,
		MinBytes:         1,                    // 10B
		MaxBytes:         10e3,                 // 10KB
		MaxWait:          1 * time.Millisecond, //cfg.kafkaMaxWait,
		ReadBatchTimeout: 1 * time.Millisecond, //cfg.kafkaMaxWait,
		ReadLagInterval:  1 * time.Millisecond, //cfg.kafkaMaxWait,
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
		log.Printf("Failed to ping database at %s:%s", cfg.dbConfig.Host, cfg.dbConfig.Port)
		log.Fatal(err)
	} else {
		log.Printf("Connected to database at %s:%s", cfg.dbConfig.Host, cfg.dbConfig.Port)
	}

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "ok")
	})
	go http.ListenAndServe(fmt.Sprintf(":%s", cfg.httpPort), nil)

	wg.Add(2)
	w := job.New(kafkaCfg)
	jobQC := make(chan bool)
	go w.Start(jobQC, &wg)
	go index_config.Start(jobQC, &wg)

	wg.Wait()

}
