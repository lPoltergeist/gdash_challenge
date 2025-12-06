package main

import (
	"os"

	"gdash/challenge/data"
	"gdash/challenge/logger"
	worker "gdash/challenge/workers"
)

func main() {
	os.MkdirAll("logs", 0755)

	data.InitRabbitMQ()
	logger.InitZap()
	defer logger.Log.Sync()

	worker.InitWorkers(5)

	select {}
}
