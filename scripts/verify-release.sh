#!/usr/bin/env bash
# Strict release gate: runs every layer it can and fails if any required gate is unavailable or failing.
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
FAILED=0
COMPOSE_STARTED=0

say() { printf '\n\033[1m== %s ==\033[0m\n' "$1"; }
pass() { printf '\033[32mPASS\033[0m %s\n' "$1"; }
fail() { printf '\033[31mFAIL\033[0m %s\n' "$1" >&2; FAILED=1; }
run_gate() {
  local label="$1"; shift
  say "$label"
  if "$@"; then pass "$label"; else fail "$label"; fi
}
cleanup() {
  if [[ "$COMPOSE_STARTED" == "1" ]] && command -v docker >/dev/null 2>&1; then
    if [[ "$FAILED" -ne 0 ]]; then docker compose -f "$ROOT/compose.yaml" logs --no-color || true; fi
    docker compose -f "$ROOT/compose.yaml" down --remove-orphans || true
  fi
}
trap cleanup EXIT

say "Toolchain diagnostics"
for cmd in node npm java python3 curl; do
  if command -v "$cmd" >/dev/null 2>&1; then printf 'FOUND  %-8s %s\n' "$cmd" "$(command -v "$cmd")"; else printf 'MISSING %-8s\n' "$cmd"; fi
done
if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  printf 'FOUND  Docker   %s\n' "$(docker --version)"
  printf 'FOUND  Compose  %s\n' "$(docker compose version --short 2>/dev/null || true)"
else
  printf 'MISSING Docker/Compose (required for the strict container release gate)\n'
fi

# Java version gate
if command -v python3 >/dev/null 2>&1; then
  run_gate "Offline cross-layer integration contract checks" python3 "$ROOT/scripts/check-integration-contracts.py"
else
  fail "Offline cross-layer integration contract checks (python3 required)"
fi
if command -v node >/dev/null 2>&1; then
  run_gate "Dependency-free resource and locale smoke checks" bash -lc "cd '$ROOT/frontend' && node scripts/check-resource-hub.mjs"
else
  fail "Dependency-free resource and locale smoke checks (Node.js required)"
fi

if command -v java >/dev/null 2>&1; then
  JAVA_MAJOR=$(java -version 2>&1 | sed -nE '1s/.* version "?([0-9]+).*/\1/p')
  if [[ "$JAVA_MAJOR" == "21" ]]; then pass "Java 21 runtime"; else fail "Java 21 runtime (found ${JAVA_MAJOR:-unknown})"; fi
else fail "Java 21 runtime"; fi

# Frontend: don't report tests/build as passes if dependencies could not be installed.
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  say "Frontend dependency install"
  if (cd "$ROOT/frontend" && npm install --no-audit --no-fund); then
    pass "Frontend dependency install"
    run_gate "Frontend tests" bash -lc "cd '$ROOT/frontend' && npm test"
    run_gate "Frontend production build" bash -lc "cd '$ROOT/frontend' && npm run build && test -s dist/index.html"
  else
    fail "Frontend dependency install (frontend tests/build are blocked)"
  fi
else fail "Frontend toolchain (Node.js and npm)"; fi

# Java: use system Maven if suitable; otherwise bootstrap the checksum-pinned version via backend/mvnw.
if command -v java >/dev/null 2>&1; then
  run_gate "Java clean verify and packaged JAR" bash -lc "cd '$ROOT/backend' && ./mvnw -B --no-transfer-progress clean verify && test -s target/platform-api-0.7.1.jar"
else fail "Java build (JDK unavailable)"; fi

# Python: install declared dependency set, then run tests and the deterministic retrieval evaluation.
if command -v python3 >/dev/null 2>&1; then
  run_gate "AI service dependency install" bash -lc "cd '$ROOT/ai-service' && python3 -m pip install --disable-pip-version-check -r requirements.txt"
  run_gate "AI service unit tests" bash -lc "cd '$ROOT/ai-service' && python3 -m pytest -q"
  run_gate "Deterministic AI grounding evaluation" bash -lc "cd '$ROOT/ai-service' && python3 -m evaluation.evaluate_retrieval"
else fail "AI service Python runtime"; fi

# Real container builds and runtime smoke are mandatory in this strict gate, never silently skipped.
if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1 && command -v curl >/dev/null 2>&1; then
  run_gate "Docker Compose configuration" docker compose -f "$ROOT/compose.yaml" config --quiet
  run_gate "Fail-closed production Compose configuration" bash -lc "cd '$ROOT' && POSTGRES_PASSWORD=ci-only-config-validation docker compose -f compose.yaml -f compose.production.yaml config --quiet"
  run_gate "Build all production containers" docker compose -f "$ROOT/compose.yaml" build --pull
  say "Start integrated containers"
  COMPOSE_STARTED=1
  if docker compose -f "$ROOT/compose.yaml" up -d; then
    pass "Start integrated containers"
    run_gate "Integrated HTTP smoke tests" "$ROOT/scripts/smoke-release.sh"
  else fail "Start integrated containers"; fi
else
  fail "Container build/smoke (Docker Compose and curl are required; not skipped in release validation)"
fi

say "Release gate summary"
if [[ "$FAILED" -eq 0 ]]; then
  echo "ALL RELEASE GATES PASSED. This is prototype verification, not production compliance certification."
  exit 0
fi
echo "RELEASE GATE FAILED. Review the failed gate(s) above; unavailable tools count as failures, not passes." >&2
exit 1
