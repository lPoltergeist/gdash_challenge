package worker

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"gdash/challenge/model"
	"gdash/challenge/queue"
)

var client = &http.Client{
	Timeout: 5 * time.Second,
}

func InitWorkers(n int) {
	weatherChan := make(chan model.WeatherData, 5)

	go func() {
		defer close(weatherChan)

		ch := queue.Consumer()
		fmt.Printf("Worker: Consumer started\n")

		for data := range ch {
			fmt.Printf("Worker: Received weather data: %+v\n", data)
			weatherChan <- data
		}
	}()

	for i := 0; i < n; i++ {
		go func(id int) {
			fmt.Printf("Worker %d started\n", id)
			for weatherData := range weatherChan {
				if err := Start(weatherData); err != nil {
					fmt.Printf("Worker %d failed to process weather: %v\n", id, err)
					continue
				}

			}
		}(i)
	}
}

func Start(payment model.WeatherData) error {

	defer func() {
		if r := recover(); r != nil {
			panic(r)
		}
	}()

	jsonBody, err := json.Marshal(payment)

	if err != nil {
		return fmt.Errorf("failed to marshal weather data: %w", err)
	}

	baseSleepTime := 10

	apiURL := os.Getenv("API_URL")
	url := fmt.Sprintf("%s/weather", apiURL)

	for attempts := 0; attempts <= 10; attempts++ {
		url := url
		sleepTime := baseSleepTime * (1 << attempts)

		fmt.Printf("Worker: Posting weather data to %s. Attempt %d\n", url, attempts+1)

		req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
		fmt.Print("Posting to ", url, "\n")
		if err != nil {
			fmt.Printf("Error: %v\n", err)
			continue
		}

		req.Header.Set("Content-Type", "application/json")

		res, err := client.Do(req)
		if err != nil {
			fmt.Printf("Error: %v\n", err)
			continue
		}

		defer res.Body.Close()
		io.Copy(io.Discard, res.Body)

		if res.StatusCode == 201 {
			return nil
		}

		time.Sleep(time.Duration(sleepTime) * time.Millisecond)
	}

	return nil
}
