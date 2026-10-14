#!/usr/bin/env bash
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
run_check() { local label="$1"; shift; echo; echo "== ${label} =="; if "$@"; then echo "PASS: ${label}"; else echo "FAIL: ${label}"; fail=1; fi; }

if command -v python >/dev/null 2>&1; then
  run_check "Python AI service tests" bash -lc "cd '$ROOT/ai-service' && python -m pytest -q"
  run_check "Deterministic retrieval evaluation" bash -lc "cd '$ROOT/ai-service' && python -m evaluation.evaluate_retrieval"
else echo "SKIP: Python not installed"; fi

if command -v npm >/dev/null 2>&1; then
  if [[ -d "$ROOT/frontend/node_modules" ]]; then
    run_check "Frontend component tests" bash -lc "cd '$ROOT/frontend' && npm test"
    run_check "Frontend production build" bash -lc "cd '$ROOT/frontend' && npm run build"
  else echo "SKIP: frontend dependencies missing; run npm install in frontend/"; fi
else echo "SKIP: npm not installed"; fi

if command -v mvn >/dev/null 2>&1; then
  run_check "Spring Boot unit and integration tests" bash -lc "cd '$ROOT/backend' && mvn test"
else echo "SKIP: Maven not installed; install Maven 3.9+ and run mvn test in backend/"; fi

if command -v docker >/dev/null 2>&1; then
  run_check "Compose configuration" docker compose -f "$ROOT/compose.yaml" config --quiet
else echo "SKIP: Docker not installed; validate compose.yaml in Docker-enabled environment"; fi

if [[ "$fail" -ne 0 ]]; then exit 1; fi
echo
echo "Available checks finished. SKIP messages are not passes; clear all skips before a public demo."
