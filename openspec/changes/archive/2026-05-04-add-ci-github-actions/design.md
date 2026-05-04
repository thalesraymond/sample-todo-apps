## Context

The project currently lacks an automated validation pipeline. Developers must run tests and linters manually before pushing code. This design outlines the implementation of a GitHub Actions workflow to automate these checks.

## Goals / Non-Goals

**Goals:**
- Automate build, lint, format, and test verification on every push and PR to `main`.
- Ensure consistent environments for validation using GitHub-hosted runners.
- Fail the workflow if any step (build, lint, test, coverage) fails.

**Non-Goals:**
- Automated deployment (CD) to production or staging environments.
- Performance benchmarking.
- Security scanning (SAST/DAST) - though this could be a future addition.

## Decisions

### Decision 1: Use `ubuntu-latest` as the runner OS
- **Rationale**: `ubuntu-latest` is the most common and cost-effective runner for standard Node.js applications. It comes pre-installed with many necessary tools.
- **Alternatives**: `macos-latest` or `windows-latest` were considered but are unnecessary for a standard backend API and are more expensive/slower.

### Decision 2: Node.js version 22
- **Rationale**: The `package.json` specifies `engines: { "node": ">=22" }`. Using Node.js 22 ensures we are testing against a modern, stable LTS-ready version that meets the project's requirements.
- **Alternatives**: Node.js 20 (previous LTS) was considered but the project explicitly requires >=22.

### Decision 3: Use `pnpm/action-setup` for dependency management
- **Rationale**: The project uses `pnpm` as indicated by the `pnpm-lock.yaml` and `packageManager` field. Using the official `pnpm/action-setup` ensures the correct version is installed and cached properly.
- **Alternatives**: `npm` or `yarn` were not considered as the project is already committed to `pnpm`.

### Decision 4: Single Job vs. Multiple Jobs
- **Rationale**: A single job is simpler to maintain and faster for a small project since it avoids the overhead of sharing artifacts between jobs.
- **Alternatives**: Splitting into `lint`, `build`, and `test` jobs would allow parallel execution but would require artifact sharing and multiple setups, likely increasing total runtime for this project size.

## Risks / Trade-offs

- **[Risk]** Flaky tests causing CI failures → **Mitigation**: Ensure all tests are deterministic; investigate and fix any flakiness immediately.
- **[Risk]** Runner resource limits (CPU/RAM) → **Mitigation**: The current project size is small and should easily fit within standard runner limits. Monitor performance.
- **[Trade-off]** Increased feedback loop time → **Mitigation**: Optimize caching for `node_modules` to keep workflow duration under 2-3 minutes.
