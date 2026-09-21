#!/usr/bin/env bash
set -e

echo "Configuring MinIO client and buckets..."
docker exec -i spotify_s3 mc alias set local http://localhost:9000 minioadmin miniopassword
docker exec -i spotify_s3 mc mb local/spotify-audio --ignore-existing
docker exec -i spotify_s3 mc anonymous set download local/spotify-audio
echo "MinIO 'spotify-audio' bucket ready."