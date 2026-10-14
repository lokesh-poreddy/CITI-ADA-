#!/usr/bin/env bash
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
run_check() { local label="$1"; shift; echo; echo "== $label =="; if "$@"; then echo "PASS: $label"; else echo "FAIL: $label"; fail=1; fi; }
if command -v npm >/dev/null 2>&1; then
  if [[ -d "$ROOT/frontend/node_modules" ]]; then
    run_check "Frontend tests" bash -lc "cd '$ROOT/frontend' && npm test"
    run_check "Frontend production build" bash -lc "cd '$ROOT/frontend' && npm run build"
  else
    echo "SKIP: frontend tests/build (frontend/node_modules is missing; run npm install in frontend/)"
  fi
else echo "SKIP: npm not installed"; fi
if command -v mvn >/dev/null 2>&1; then run_check "Spring Boot tests" bash -lc "cd '$ROOT/backend' && mvn test"; else echo "SKIP: Maven not installed; run mvn test in backend/"; fi
if command -v python >/dev/null 2>&1 && python - <<'PYCHK'
import importlib.util,sys; sys.exit(0 if importlib.util.find_spec('pytest') else 1)
PYCHK
then run_check "AI service tests" bash -lc "cd '$ROOT/ai-service' && python -m pytest -q"; else echo "SKIP: pytest not installed"; fi
if [[ "$fail" -ne 0 ]]; then exit 1; fi
echo; echo "Completed available checks. Skipped checks require local dependencies; do not treat skips as passes."
