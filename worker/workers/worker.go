package worker

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"go.uber.org/zap"

	"gdash/challenge/logger"
	"gdash/challenge/queue"
)

var client = &http.Client{
	Timeout: 5 * time.Second,
}

func InitWorkers(n int) {
	weatherChan := make(chan queue.WeatherMessage, 5)

	go func() {
		defer close(weatherChan)

		ch := queue.Consumer()

		for msg := range ch {

			logger.Log.Info("Received message",
				zap.Any("payload", msg.Data),
				zap.String("message_id", msg.Msg.MessageId))

			weatherChan <- msg
		}
	}()

	for i := 0; i < n; i++ {
		go func(id int) {
			for weatherMsg := range weatherChan {
				if err := Start(weatherMsg); err != nil {

					logger.ErrorLog("Failed to unmarshal message",
						err, weatherMsg.Data, weatherMsg.Msg.MessageId)

					weatherMsg.Msg.Nack(false, true)
					continue
				}
			}
		}(i)
	}
}

func Start(msg queue.WeatherMessage) error {

	defer func() {
		if r := recover(); r != nil {
			msg.Msg.Nack(false, true)
		}
	}()

	jsonBody, err := json.Marshal(msg.Data)

	if err != nil {
		logger.ErrorLog("Failed to unmarshal message",
			err, msg.Data, msg.Msg.MessageId)

		return err
	}

	baseSleepTime := 10

	apiURL := os.Getenv("API_URL")
	url := fmt.Sprintf("%s/weather", apiURL)

	for attempts := 0; attempts <= 10; attempts++ {
		url := url
		sleepTime := baseSleepTime * (3 << attempts)

		logger.Log.Info("Worker: Posting weather data to",
			zap.String("url", url),
			zap.Any("Attempt", attempts+1))

		req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))

		if err != nil {

			logger.ErrorLog("Failed to unmarshal message",
				err, msg.Data, msg.Msg.MessageId)
			msg.Msg.Nack(false, true)

			continue
		}

		req.Header.Set("Content-Type", "application/json")

		res, err := client.Do(req)
		if err != nil {

			logger.ErrorLog("Failed to do a request",
				err, msg.Data, msg.Msg.MessageId)

			msg.Msg.Nack(false, true)
			continue
		}

		defer res.Body.Close()
		io.Copy(io.Discard, res.Body)

		if res.StatusCode == 201 {
			msg.Msg.Ack(false)
			return nil
		}

		time.Sleep(time.Duration(sleepTime) * time.Millisecond)
	}

	msg.Msg.Nack(false, true)
	return nil
}
