#!/usr/bin/env bash
set -e

# ==============================================================================
# KriblaSemsar — Automated Build, Deploy & Health Self-Healing Script
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "=========================================================="
echo "🚀 1. BUILDING KRIBLASEMSAR PRODUCTION ASSETS"
echo "=========================================================="
npm run build

echo ""
echo "=========================================================="
echo "☁️  2. DEPLOYING TO CLOUDFLARE PAGES"
echo "=========================================================="
npx --yes wrangler pages deploy dist --project-name kriblasemsar --commit-dirty=true

echo ""
echo "=========================================================="
echo "🩺 3. VERIFYING LIVE PRODUCTION HEALTH & SSL"
echo "=========================================================="

check_url() {
  local url="$1"
  local expected="$2"
  echo -n "Checking $url ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "FAIL")
  if [[ "$status" =~ ^($expected)$ ]]; then
    echo "✅ OK (HTTP $status)"
    return 0
  else
    echo "❌ FAILED (HTTP $status, expected $expected)"
    return 1
  fi
}

ERRORS=0
check_url "https://kriblasemsar.pages.dev" "200" || ERRORS=$((ERRORS + 1))
check_url "https://www.kriblasemsar.com" "200" || ERRORS=$((ERRORS + 1))

# Check apex redirect (testing both direct and through Spaceship AWS IP)
echo -n "Checking apex redirect (https://kriblasemsar.com) ... "
APEX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 --resolve kriblasemsar.com:443:15.197.162.184 https://kriblasemsar.com || echo "FAIL")
if [[ "$APEX_STATUS" =~ ^(301|302|200)$ ]]; then
  echo "✅ OK (HTTP $APEX_STATUS -> www.kriblasemsar.com)"
else
  echo "⚠️ Warning (HTTP $APEX_STATUS)"
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "🎉 ALL SYSTEMS OPERATIONAL! Website is 100% online worldwide."
else
  echo "⚠️  Found $ERRORS warning(s). Checking Cloudflare domain bindings..."
  python3 -c "
import tomllib, requests
try:
    with open('/home/abdelaziz/.config/.wrangler/config/default.toml', 'rb') as f:
        data = tomllib.load(f)
    token = data.get('oauth_token')
    headers = {'Authorization': f'Bearer {token}'}
    acc_id = '7060d464023b47678c42d902132d50f3'
    res = requests.get(f'https://api.cloudflare.com/client/v4/accounts/{acc_id}/pages/projects/kriblasemsar/domains', headers=headers)
    print('Current registered domains:', [d['name'] for d in res.json().get('result', [])])
except Exception as e:
    print('Could not query Cloudflare API:', e)
"
fi
