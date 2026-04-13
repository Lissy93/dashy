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

# Save a new config, and verify that changes took effect
curl -sf -X POST -H "Content-Type: application/json" \
  -d '{"config":"pageInfo:\n  title: Smoke Test\nsections: []\n"}' \
  "http://localhost:$PORT/config-manager/save" | grep -q '"success":true' \
  || fail "POST /config-manager/save did not return success"
curl -sf "http://localhost:$PORT/conf.yml" | grep -q "Smoke Test" \
  || fail "conf.yml does not reflect saved content"
echo "OK: POST /config-manager/save (write verified)"

# CORS proxy validates requests
PROXY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/cors-proxy")
[ "$PROXY_STATUS" = "400" ] || fail "/cors-proxy expected 400, got $PROXY_STATUS"
echo "OK: GET /cors-proxy (validation)"

# Status check endpoint responds
curl -sf "http://localhost:$PORT/status-check/" | grep -q "successStatus" \
  || fail "/status-check missing expected response shape"
echo "OK: GET /status-check"

# Container logs don't show any errors or no crash signatures
LOGS=$(docker logs "$CONTAINER" 2>&1)
for sig in "ERR_HTTP_HEADERS_SENT" "ERR_STREAM_WRITE_AFTER_END" "UnhandledPromiseRejection" "FATAL ERROR"; do
  echo "$LOGS" | grep -qi "$sig" && fail "crash signature in logs: $sig"
done
echo "OK: container logs clean"

echo "All smoke tests passed"
