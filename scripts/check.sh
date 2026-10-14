#!/usr/bin/env bash
# Strict one-command release gate. Use check-phase-25-28.sh for optional local checks.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec "$ROOT/scripts/verify-release.sh" "$@"
