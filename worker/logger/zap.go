package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

var Log *zap.Logger

func InitZap() {

	os.MkdirAll("logs", 0755)

	writer := zapcore.AddSync(&lumberjack.Logger{
		Filename:   "logs/worker.log",
		MaxSize:    10,
		MaxBackups: 100,
		MaxAge:     30,
		Compress:   true,
	})

	encoderCfg := zap.NewProductionEncoderConfig()
	encoderCfg.TimeKey = "timestamp"
	encoderCfg.EncodeTime = zapcore.ISO8601TimeEncoder

	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderCfg),
		writer,
		zap.InfoLevel,
	)

	Log = zap.New(core, zap.AddCaller())

}

func ErrorLog(action string, err error, payload interface{}, messageID interface{}) {
	Log.Error(action,
		zap.Error(err),
		zap.Any("payload", payload),
		zap.Any("message_id", messageID),
	)
}
