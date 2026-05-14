#!/usr/bin/env bash
set -euo pipefail

APPS_IP="172.18.0.3"
BINARY="/home/gem/projects/CoderyTrailhead/target/release/trailhead-service"
DB_PATH="/tmp/trailhead-e2e.db"
CONFIG_PATH="/tmp/trailhead-e2e-config.toml"
PORT=4050

ssh gem@apps "pkill -f 'trailhead-service daemon' 2>/dev/null; sleep 0.3; rm -f $DB_PATH $CONFIG_PATH" 2>/dev/null || true

DSK_KEY=$(printenv DEEPSEEK_API_KEY)

ssh gem@apps "cat > $CONFIG_PATH" <<TOMLEOF
model = "deepseek/deepseek-chat"

[provider.deepseek]
api = "openai-compatible"
base_url = "https://api.deepseek.com/v1"
env = ["DEEPSEEK_API_KEY"]
TOMLEOF

ssh gem@apps "DEEPSEEK_API_KEY='$DSK_KEY' MAX_GLOBAL_WORKERS=0 SCHEDULER_INTERVAL_SECS=3600 nohup $BINARY daemon --port $PORT --db $DB_PATH --config $CONFIG_PATH > /tmp/trailhead-e2e.log 2>&1 &"

sleep 2

for i in $(seq 1 20); do
    if curl -s -o /dev/null -w '' "http://${APPS_IP}:${PORT}/api/v1/jobs" 2>/dev/null; then
        echo "trailhead-service ready on ${APPS_IP}:${PORT}"
        exit 0
    fi
    sleep 0.5
done

echo "ERROR: trailhead-service failed to start" >&2
ssh gem@apps "cat /tmp/trailhead-e2e.log" 2>/dev/null || true
exit 1
