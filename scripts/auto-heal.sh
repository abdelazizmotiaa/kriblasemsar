#!/usr/bin/env bash
# ==============================================================================
# KriblaSemsar — Automated Watcher & Self-Healing Script
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="$PROJECT_DIR/logs/health.log"
mkdir -p "$PROJECT_DIR/logs"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

STATUS_PAGES=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://kriblasemsar.pages.dev || echo "000")
STATUS_WWW=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://www.kriblasemsar.com || echo "000")

echo "[$TIMESTAMP] Health check: pages.dev=$STATUS_PAGES, www=$STATUS_WWW" >> "$LOG_FILE"

if [ "$STATUS_PAGES" != "200" ] || [ "$STATUS_WWW" != "200" ]; then
  echo "[$TIMESTAMP] 🚨 ALERT: Downtime detected! Triggering automated self-heal..." >> "$LOG_FILE"
  
  cd "$PROJECT_DIR"
  npm run build >> "$LOG_FILE" 2>&1
  npx --yes wrangler pages deploy dist --project-name kriblasemsar --commit-dirty=true >> "$LOG_FILE" 2>&1
  
  # Ensure domain is bound
  python3 -c "
import tomllib, requests
try:
    with open('/home/abdelaziz/.config/.wrangler/config/default.toml', 'rb') as f:
        data = tomllib.load(f)
    token = data.get('oauth_token')
    headers = {'Authorization': f'Bearer {token}'}
    acc_id = '7060d464023b47678c42d902132d50f3'
    # Bind www
    requests.post(f'https://api.cloudflare.com/client/v4/accounts/{acc_id}/pages/projects/kriblasemsar/domains', headers=headers, json={'name': 'www.kriblasemsar.com'})
except Exception as e:
    pass
" >> "$LOG_FILE" 2>&1

  NEW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://www.kriblasemsar.com || echo "000")
  echo "[$TIMESTAMP] Self-healing complete. New status: $NEW_STATUS" >> "$LOG_FILE"
else
  echo "[$TIMESTAMP] System Healthy. No repair needed."
fi
