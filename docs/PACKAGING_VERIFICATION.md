# Packaging Verification — Phases 09–17

Verification date: 14 October 2026.

## Checks completed in the packaging workspace

- Archive/repository manifest files: parsed as valid JSON (11 JSON files).
- Seed data includes a dated NSP renewal notice plus a separate undated scholarship-discovery reference; a portal reference is not represented as an open scheme.
- Python modules: `python -m compileall -q app tests` completed.
- Python AI gateway test suite: **6 passed**.
- JavaScript/JSX syntax transpilation: **14 files, zero syntax diagnostics** using the environment's TypeScript transpiler. This is a syntax check, not a full Vite production build.
- Localized UI dictionaries: all referenced `t.*` keys exist in English, Hindi and Tamil dictionaries.

## Checks not completed

- `npm install`, `npm test` and `npm run build`: dependency installation did not complete in the packaging environment. Run these on the team development machine.
- `mvn test`: Maven was not installed in the packaging environment. Java integration/unit tests are included but not claimed as passed.
- End-to-end browser/network profile checks: not run in a real mobile browser. Verify on a low-end Android device and throttled network before demo.

## Required pre-merge commands

```bash
./scripts/check-phase-09-17.sh
cd frontend && npm install && npm test && npm run build
cd ../backend && mvn test
```

Any `SKIP` line emitted by the verification script is an outstanding release check, not a pass.
