# Build Validation and Toolchain Policy

## Required release gates

A release candidate is not approved until all of the following succeed:

1. Frontend dependencies install successfully.
2. Frontend unit/component tests pass.
3. Vite production build succeeds and `frontend/dist/index.html` exists.
4. Java 21 + Spring Boot executes `./backend/mvnw -B --no-transfer-progress clean verify` and produces `backend/target/platform-api-0.7.1.jar`.
5. Python AI service tests pass.
6. Deterministic retrieval/grounding evaluation passes.
7. `docker compose -f compose.yaml config --quiet` succeeds.
8. All three production images build successfully.
9. The Compose stack starts, becomes healthy, and passes `scripts/smoke-release.sh` against frontend, API actuator/application health, release status, privacy notice, AI health, and AI capabilities.

Run the gates with:

```bash
./scripts/doctor.sh
./scripts/verify-release.sh
```

`./scripts/check-phase-25-28.sh` is a developer convenience that may report SKIP when a tool is missing. It is not a release sign-off. The strict verifier treats an unavailable required tool as failure.

## Maven wrapper

The custom wrapper uses system Maven 3.9+ where available; otherwise it bootstraps Maven 3.9.11 under the user Maven cache. The downloaded distribution is SHA-512 checked before extraction/execution. Unix/macOS uses the `.tar.gz` distribution and `sha512sum` or `shasum`; Windows uses the `.zip` distribution and PowerShell `Get-FileHash`.

## Frontend dependency lock

At authoring time, `frontend/package-lock.json` was not available because the package registry could not be resolved from the authoring container. All direct dependencies are exact-version pins in `frontend/package.json`, but this does not fully pin transitive dependencies. On a network-enabled machine, run:

```bash
cd frontend
npm install --no-audit --no-fund
# Review package-lock.json and commit it.
```

After the lockfile is committed, update CI and the Dockerfile to use `npm ci` rather than `npm install`. Do not hand-author a lockfile; let npm resolve and verify the dependency graph.

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request. It includes separate jobs for frontend build/tests, Java clean verification, Python tests/grounding evaluation, and a dependent container-integration job that builds all images, starts the Compose stack and runs the HTTP smoke checks. The container job is a real runtime check—not just YAML syntax validation.

## Evidence and environment limitations

Build evidence must record PASS, FAIL, or BLOCKED explicitly. A syntax check is not a successful production build. Python unit tests do not validate the Java API, React bundle or container runtime. A configured GitHub workflow does not count as passing until a run completes successfully on the target commit.

The code-generation environment used for this ZIP did not resolve external DNS and did not provide Docker. Therefore, the Maven distribution, Maven dependencies, npm dependencies and production container images could not be downloaded here. Python unit tests and deterministic evaluation can run from the packages already installed in the workspace, but the full release gate must run on a network-enabled developer machine or GitHub Actions runner. Do not label the release production-ready until those gates complete.
