#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

printf '\n== UdaanSetu: Phases 09–17 verification ==\n'

if command -v python >/dev/null 2>&1; then
  (cd "$ROOT/ai-service" && python -m compileall -q app tests && python -m pytest -q)
else
  echo "BLOCKED Python checks: install Python and ai-service/requirements.txt." >&2
  exit 2
fi

if command -v npm >/dev/null 2>&1 && [ -d "$ROOT/frontend/node_modules" ]; then
  (cd "$ROOT/frontend" && npm test && npm run build)
else
  echo "SKIP frontend test/build: run 'npm install' in frontend/ first."
fi

if command -v mvn >/dev/null 2>&1; then
  (cd "$ROOT/backend" && mvn test)
else
  echo "SKIP Java tests: install Maven 3.9+ and rerun 'mvn test' in backend/."
fi

printf '\nVerification script finished. Any SKIP line above must be resolved before release.\n'
