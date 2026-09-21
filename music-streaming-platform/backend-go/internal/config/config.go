package config

import (
	"os"
)

type Config struct {
	Port        string
	S3Endpoint  string
	S3Region    string
	S3Bucket    string
	S3AccessKey string
	S3SecretKey string
}

func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	endpoint := os.Getenv("S3_ENDPOINT")
	if endpoint == "" {
		endpoint = "http://localhost:9000"
	}
	bucket := os.Getenv("S3_BUCKET")
	if bucket == "" {
		bucket = "spotify-audio"
	}

	return &Config{
		Port:        port,
		S3Endpoint:  endpoint,
		S3Region:    getEnvDefault("S3_REGION", "us-east-1"),
		S3Bucket:    bucket,
		S3AccessKey: getEnvDefault("S3_ACCESS_KEY", "minioadmin"),
		S3SecretKey: getEnvDefault("S3_SECRET_KEY", "miniopassword"),
	}
}

func getEnvDefault(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
