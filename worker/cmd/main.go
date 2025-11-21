package main

import (
	"gdash/challenge/data"
	worker "gdash/challenge/workers"
)

func main() {
	data.InitRabbitMQ()

	worker.InitWorkers(5)

	select {}
}
