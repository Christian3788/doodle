package main

import (
	"log"
	"net/http"

	"github.com/spotify-clone/backend-go/internal/config"
	"github.com/spotify-clone/backend-go/internal/handler"
	"github.com/spotify-clone/backend-go/internal/s3client"
	"github.com/spotify-clone/backend-go/internal/websocket"
)

func main() {
	cfg := config.LoadConfig()

	s3Client, err := s3client.NewS3Client(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize S3 client: %v", err)
	}

	hub := websocket.NewHub()
	go hub.Run()

	audioHandler := handler.NewAudioHandler(s3Client, cfg.S3Bucket)

	mux := http.NewServeMux()
	mux.Handle("/stream/", corsMiddleware(audioHandler))
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		websocket.ServeWs(hub, w, r)
	})
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"healthy"}`))
	})

	log.Printf("Audio service listening on port :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, mux); err != nil {
		log.Fatal(err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Range, Content-Type")
		w.Header().Set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}