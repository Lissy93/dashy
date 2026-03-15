#!/bin/sh
set -e

IMAGE="dashy-smoke-test"
CONTAINER="dashy-smoke-$$"

cleanup() {
  echo "Cleaning up..."
  docker rm -f "$CONTAINER" 2>/dev/null || true
  docker rmi -f "$IMAGE" 2>/dev/null || true
}
trap cleanup EXIT

# Build the Docker image
echo "Building Docker image..."
docker build -t "$IMAGE" .

# Run container with a random host port mapped to 8080
echo "Starting container..."
docker run -d --name "$CONTAINER" -P "$IMAGE"

# Discover the host port Docker assigned to container port 8080
PORT=$(docker port "$CONTAINER" 8080 | head -1 | cut -d: -f2)
echo "Container exposed on port $PORT"

# Wait for the container to become healthy (poll every 2s, max ~90s)
echo "Waiting for container to be ready..."
for i in $(seq 1 45); do
  if curl -sf "http://localhost:$PORT" > /dev/null 2>&1; then
    echo "Container is ready (after ~$((i * 2))s)"
    break
  fi
  if [ "$i" -eq 45 ]; then
    echo "FAIL: container did not become ready within 90s"
    echo "--- Container logs ---"
    docker logs "$CONTAINER"
    exit 1
  fi
  sleep 2
done

# Endpoint check helper
fail() {
  echo "FAIL: $1"
  echo "--- Container logs ---"
  docker logs "$CONTAINER"
  exit 1
}

check() {
  URL="$1"
  EXPECTED="$2"
  RESP=$(curl -sf "$URL") || fail "$URL returned non-200"
  if [ -n "$EXPECTED" ]; then
    echo "$RESP" | grep -q "$EXPECTED" || fail "$URL missing '$EXPECTED'"
  fi
  echo "OK: $URL"
}

# Check key endpoints
check "http://localhost:$PORT/" "<title>"
check "http://localhost:$PORT/conf.yml" "pageInfo"
check "http://localhost:$PORT/system-info" "meta"

echo "All smoke tests passed"
