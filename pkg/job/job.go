package job

import (
	"context"
	"io"
	"log"
	"sync"
	"time"

	"github.com/astraline/astraline-filtering-service/pkg/parser"
	"github.com/segmentio/kafka-go"
)

const (
	kafkaReadTimeout = 1
)

type job struct {
	kafkaCfg kafka.ReaderConfig
}

func New(kafkaCfg kafka.ReaderConfig) job {
	return job{kafkaCfg}
}

func (w *job) Start(q chan bool, wg *sync.WaitGroup) {
	defer wg.Done()

	for {
		reader := kafka.NewReader(w.kafkaCfg)
		log.Println("Connecting to kafka")
		err := w.run(q, reader)
		reader.Close()
		if err == nil {
			return
		}
	}
}

func (w *job) run(q chan bool, reader *kafka.Reader) error {
	for {
		select {
		case <-q:
			return nil
		default:
			err := w.readTx(reader)
			if err == io.EOF {
				log.Println("connection to kafka has been closed, retrying...")
				return err
			}
			if err != nil {
				log.Fatal(err)
			}
		}
	}
}

func (w *job) readTx(reader *kafka.Reader) error {
	ctx := context.Background()
	ctxTimeout, cancel := context.WithTimeout(ctx, kafkaReadTimeout*time.Second)
	defer cancel()

	var err error
	done := make(chan kafka.Message)
	go func(done chan kafka.Message) {
		msg, e := reader.FetchMessage(ctxTimeout)
		err = e
		done <- msg
	}(done)

	select {
	case msg := <-done:
		cancel()
		time.Sleep(10 * time.Second)
		if err != nil {
			return err
		}
		// we wanna block on processing that message
		// so service process one message at a time
		parser.ProcessKafkaMsg(msg)
	case <-ctxTimeout.Done():
		return nil
	}
	return nil
}
