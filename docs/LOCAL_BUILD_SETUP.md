# Local Build Setup

## macOS (Apple Silicon or Intel)

1. Install Node.js 22, Python 3.13, and a Java 21 JDK. Homebrew is one supported route:

   ```bash
   brew install node@22 python@3.13 openjdk@21
   ```

   Follow Homebrew's post-install notes for adding Java/Node to `PATH`.
2. Install Docker Desktop and start it; wait until the Docker engine is running.
3. The checked-in `backend/mvnw` script can bootstrap Maven 3.9.11 if no Maven 3.9+ installation is available. First use requires network access.
4. From the extracted project root, run:

   ```bash
   ./scripts/doctor.sh
   ./scripts/verify-release.sh
   ```

## Windows 11

Install Node.js 22, Python 3.13, a Java 21 JDK, and Docker Desktop. `backend\\mvnw.cmd` can bootstrap Maven if needed. Use Git Bash or WSL to run the repository-wide shell scripts; PowerShell can run the Maven wrapper directly from `backend`:

```powershell
.\\mvnw.cmd -B --no-transfer-progress clean verify
```

For the frontend:

```powershell
cd frontend
npm install --no-audit --no-fund
npm test
npm run build
```

## Network, package cache, and offline constraints

The first build needs access to npm and Maven dependency repositories and container registries. Offline mode cannot build this project from source unless the complete npm/Maven/container caches have already been populated. A previously cached PWA shell is not equivalent to a developer build.

If package installation fails, capture the first resolver/download error. Do not suppress it or interpret a skipped build as a passing test. When the first frontend install succeeds, commit the generated `frontend/package-lock.json`; subsequent CI and Docker builds should use `npm ci`.
