#!/usr/bin/env bash
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
status=0
check_cmd() {
  local name="$1" command_name="$2" min_version="${3:-}" output
  if ! command -v "$command_name" >/dev/null 2>&1; then
    printf 'MISSING  %-12s %s\n' "$name" "$command_name"
    status=1
    return
  fi
  case "$command_name" in
    java) output=$(java -version 2>&1 | head -n 1) ;;
    node) output=$(node --version 2>&1 | head -n 1) ;;
    npm) output=$(npm --version 2>&1 | head -n 1) ;;
    python|python3) output=$(python3 --version 2>&1 | head -n 1) ;;
    docker) output=$(docker --version 2>&1 | head -n 1) ;;
    *) output=$("$command_name" --version 2>&1 | head -n 1) ;;
  esac
  printf 'FOUND    %-12s %s\n' "$name" "$output"
}
check_cmd Java java
check_cmd Node node
check_cmd npm npm
check_cmd Python python3
if command -v docker >/dev/null 2>&1; then
  check_cmd Docker docker
  if docker compose version >/dev/null 2>&1; then echo "FOUND    Compose      $(docker compose version --short 2>/dev/null || true)"; else echo "MISSING  Compose      docker compose plugin"; status=1; fi
else
  echo "MISSING  Docker       docker (optional for local source tests; required for container release check)"
fi
if [[ -x "$ROOT/backend/mvnw" ]]; then echo "READY    Maven        pinned wrapper present (downloads Maven if needed)"; elif command -v mvn >/dev/null 2>&1; then echo "FOUND    Maven        $(mvn -version 2>&1 | head -n 1)"; else echo "MISSING  Maven        backend/mvnw will bootstrap from Maven Central; network required"; fi
if [[ -f "$ROOT/frontend/package-lock.json" ]]; then echo "FOUND    npm lock     package-lock.json present"; else echo "WARN     npm lock     absent; run npm install in frontend and commit the generated package-lock.json for reproducible installs"; fi
if [[ "$status" -eq 0 ]]; then echo "Core tools detected. Use ./scripts/verify-release.sh for strict validation."; else echo "One or more core tools are missing. Review the setup guide before a release build."; fi
exit 0
