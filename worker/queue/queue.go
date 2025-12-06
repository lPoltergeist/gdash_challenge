package queue

import (
	"encoding/json"
	"fmt"

	"github.com/rabbitmq/amqp091-go"
	"go.uber.org/zap"

	"gdash/challenge/data"
	"gdash/challenge/logger"
	"gdash/challenge/model"
)

type WeatherMessage struct {
	Data model.WeatherData
	Msg  amqp091.Delivery
}

func Consumer() <-chan WeatherMessage {
	weatherChan := make(chan WeatherMessage, 5)

	if data.RabbitConn == nil {
		logger.Log.Error("RabbitMQ connection is not initialized")
		panic("RabbitMQ connection is not initialized")
	}

	ch, err := data.RabbitConn.Channel()
	if err != nil {
		logger.Log.Info("Failed to open a channel!",
			zap.Any("Error:", err),
		)
		panic(err)
	}

	_, err = ch.QueueDeclare(
		"weather_queue",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		logger.Log.Info("Failed to declare a queue!",
			zap.Any("Error:", err),
		)

		panic(err)
	}

	msgs, err := ch.Consume(
		"weather_queue",
		"",
		false,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		fmt.Printf("Failed to register a consumer: %v\n", err)
		panic(err)
	}

	go func() {

		for msg := range msgs {
			var weather model.WeatherData
			if err := json.Unmarshal(msg.Body, &weather); err != nil {

				logger.ErrorLog("Failed to unmarshal message",
					err, msg.Body, msg.MessageId)

				msg.Nack(false, true)
				continue
			}

			logger.Log.Info("Received message",
				zap.Any("payload", weather),
				zap.String("message_id", msg.MessageId))

			weatherChan <- WeatherMessage{
				Data: weather,
				Msg:  msg,
			}
		}
	}()
	return weatherChan
}
