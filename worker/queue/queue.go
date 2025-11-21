package queue

import (
	"encoding/json"
	"fmt"

	"gdash/challenge/data"
	"gdash/challenge/model"
)

func Consumer() <-chan model.WeatherData {
	weatherChan := make(chan model.WeatherData, 5)

	if data.RabbitConn == nil {
		fmt.Printf("RabbitMQ connection is not initialized\n")
		panic("RabbitMQ connection is not initialized")
	}

	ch, err := data.RabbitConn.Channel()
	if err != nil {
		fmt.Printf("Failed to open a channel: %v\n", err)
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
		fmt.Printf("Failed to declare a queue: %v\n", err)
		panic(err)
	}

	msgs, err := ch.Consume(
		"weather_queue",
		"",
		true,
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
				fmt.Printf("Error on unmarshalling json %v\n", err)
				continue
			}
			fmt.Printf("Received weather data!")
			weatherChan <- weather
		}
	}()
	return weatherChan
}
