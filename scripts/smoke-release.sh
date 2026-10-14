#!/usr/bin/env bash
set -euo pipefail
API_BASE="${API_BASE:-http://localhost:8080}"
AI_BASE="${AI_BASE:-http://localhost:8000}"
FRONTEND_BASE="${FRONTEND_BASE:-http://localhost:5173}"
WAIT_SECONDS="${SMOKE_WAIT_SECONDS:-90}"

check_once() {
  local name="$1" url="$2" expected="${3:-200}" code
  code=$(curl --silent --show-error --max-time 5 -o /tmp/udaan-smoke.out -w '%{http_code}' "$url" 2>/dev/null || true)
  if [[ "$code" == "$expected" ]]; then
    printf 'PASS %-30s HTTP %s %s\n' "$name" "$code" "$url"
    return 0
  fi
  return 1
}
wait_for() {
  local name="$1" url="$2" expected="${3:-200}" elapsed=0
  until check_once "$name" "$url" "$expected"; do
    if (( elapsed >= WAIT_SECONDS )); then
      echo "FAIL $name did not become ready in ${WAIT_SECONDS}s ($url)" >&2
      [[ -f /tmp/udaan-smoke.out ]] && cat /tmp/udaan-smoke.out >&2 || true
      return 1
    fi
    sleep 2; elapsed=$((elapsed+2))
  done
}

wait_for "frontend root" "$FRONTEND_BASE/"
wait_for "API actuator health" "$API_BASE/actuator/health"
wait_for "API application health" "$API_BASE/api/v1/health"
wait_for "API release boundary" "$API_BASE/api/v1/release/status"
wait_for "API privacy notice" "$API_BASE/api/v1/privacy/notice"
wait_for "AI gateway health" "$AI_BASE/api/v1/health"
wait_for "AI capabilities" "$AI_BASE/api/v1/capabilities"

echo "Container smoke checks passed. These establish route reachability only—not production readiness."
