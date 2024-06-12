package database

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

var (
	Conn *sqlx.DB
)

type DBConfig struct {
	// dbConfig: "user=postgres dbname=postgres sslmode=disable password=postgres host=localhost",
	User     string
	DBName   string
	SslMode  string
	Password string
	Host     string
}

func (d *DBConfig) String() string {
	return fmt.Sprintf("user=%s dbname=%s sslmode=%s password=%s host=%s",
		d.User, d.DBName, d.SslMode, d.Password, d.Host)
}
