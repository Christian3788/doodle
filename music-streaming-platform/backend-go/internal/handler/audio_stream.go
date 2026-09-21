package handler

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type AudioHandler struct {
	s3Client *s3.Client
	bucket   string
}

func NewAudioHandler(client *s3.Client, bucket string) *AudioHandler {
	return &AudioHandler{s3Client: client, bucket: bucket}
}

var rangeRegex = regexp.MustCompile(`^bytes=(\d+)-(\d*)$`)

func (h *AudioHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	key := strings.TrimPrefix(r.URL.Path, "/stream/")
	if key == "" {
		http.Error(w, "Missing track identifier", http.StatusBadRequest)
		return
	}

	head, err := h.s3Client.HeadObject(r.Context(), &s3.HeadObjectInput{
		Bucket: aws.String(h.bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		http.Error(w, "Track not found", http.StatusNotFound)
		return
	}

	totalSize := *head.ContentLength
	contentType := "audio/mpeg"
	if head.ContentType != nil {
		contentType = *head.ContentType
	}

	w.Header().Set("Accept-Ranges", "bytes")
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")

	rangeHeader := r.Header.Get("Range")
	if rangeHeader == "" {
		w.Header().Set("Content-Length", strconv.FormatInt(totalSize, 10))
		w.WriteHeader(http.StatusOK)

		obj, err := h.s3Client.GetObject(r.Context(), &s3.GetObjectInput{
			Bucket: aws.String(h.bucket),
			Key:    aws.String(key),
		})
		if err == nil {
			defer obj.Body.Close()
			_, _ = io.Copy(w, obj.Body)
		}
		return
	}

	matches := rangeRegex.FindStringSubmatch(rangeHeader)
	if len(matches) < 2 {
		w.Header().Set("Content-Range", fmt.Sprintf("bytes */%d", totalSize))
		http.Error(w, "Invalid range format", http.StatusRequestedRangeNotSatisfiable)
		return
	}

	start, err := strconv.ParseInt(matches[1], 10, 64)
	if err != nil || start >= totalSize {
		w.Header().Set("Content-Range", fmt.Sprintf("bytes */%d", totalSize))
		http.Error(w, "Range start outside limits", http.StatusRequestedRangeNotSatisfiable)
		return
	}

	const chunkSize = 1024 * 1024 // 1MB chunk size
	end := start + chunkSize - 1
	if matches[2] != "" {
		if reqEnd, parseErr := strconv.ParseInt(matches[2], 10, 64); parseErr == nil && reqEnd < end {
			end = reqEnd
		}
	}
	if end >= totalSize {
		end = totalSize - 1
	}

	chunkLength := (end - start) + 1
	obj, err := h.s3Client.GetObject(r.Context(), &s3.GetObjectInput{
		Bucket: aws.String(h.bucket),
		Key:    aws.String(key),
		Range:  aws.String(fmt.Sprintf("bytes=%d-%d", start, end)),
	})
	if err != nil {
		log.Printf("S3 read range error: %v", err)
		http.Error(w, "Streaming error", http.StatusInternalServerError)
		return
	}
	defer obj.Body.Close()

	w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, totalSize))
	w.Header().Set("Content-Length", strconv.FormatInt(chunkLength, 10))
	w.WriteHeader(http.StatusPartialContent)

	_, _ = io.Copy(w, obj.Body)
}
