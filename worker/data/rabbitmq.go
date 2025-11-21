package data

import (
	"fmt"

	ampq "github.com/rabbitmq/amqp091-go"
)

var (
	RabbitConn *ampq.Connection
	RabbitChan *ampq.Channel
)

func InitRabbitMQ() error {
	host := "rabbitmq"
	user := "rabbitmq"
	pass := "rabbitmq"

	uri := fmt.Sprintf("amqp://%s:%s@%s:5672/", user, pass, host)

	conn, err := ampq.Dial(uri)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open a channel: %w", err)
	}

	RabbitConn = conn
	RabbitChan = ch

	fmt.Println("Connected to RabbitMQ")
	return nil
}
