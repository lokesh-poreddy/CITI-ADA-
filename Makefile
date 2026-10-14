.PHONY: doctor verify check-available check-contracts frontend-install frontend-test frontend-build api-test ai-test ai-eval compose-config compose-build compose-up compose-smoke compose-down

doctor:
	./scripts/doctor.sh

# Strict release gate: fails if required tools/builds/services cannot be verified.
verify:
	./scripts/verify-release.sh

# Fast local checks; may report SKIP where tools are not installed.
check-available:
	./scripts/check-phase-25-28.sh

# Offline source-contract checks; not a replacement for full runtime builds.
check-contracts:
	python3 scripts/check-integration-contracts.py

frontend-install:
	cd frontend && npm install --no-audit --no-fund

frontend-test:
	cd frontend && npm test

frontend-build:
	cd frontend && npm run build

api-test:
	cd backend && ./mvnw -B --no-transfer-progress clean verify

ai-test:
	cd ai-service && python3 -m pytest -q

ai-eval:
	cd ai-service && python3 -m evaluation.evaluate_retrieval

compose-config:
	docker compose -f compose.yaml config --quiet

compose-build:
	docker compose -f compose.yaml build --pull

compose-up:
	docker compose -f compose.yaml up -d

compose-smoke:
	./scripts/smoke-release.sh

compose-down:
	docker compose -f compose.yaml down --remove-orphans
