## Context

The project is a monorepo. The user has specifically requested Dependabot configuration for the `typescript/` project. The `typescript/` project uses `pnpm`.

## Goals / Non-Goals

**Goals:**
- Automate dependency updates for the `typescript/` project.
- Ensure security vulnerabilities are addressed via automated PRs.

**Non-Goals:**
- Configuring Dependabot for other sub-projects in the monorepo (client, go, ruby, csharp).
- Setting up auto-merge for Dependabot PRs.

## Decisions

- **Package Ecosystem**: `npm`. Dependabot supports `pnpm` through the `npm` ecosystem by looking for `pnpm-lock.yaml`.
- **Directory**: `/typescript`. This targets the package files in the `typescript/` folder.
- **Schedule**: Weekly (Mondays). This provides a good balance between staying up-to-date and developer workload.
- **PR Limit**: Set `open-pull-requests-limit` to 10 to avoid overwhelming the PR queue.

## Risks / Trade-offs

- **[Risk]** Large volume of PRs for an older project. → **[Mitigation]** Set a PR limit and use weekly scheduling.
- **[Risk]** Breaking changes from major version updates. → **[Mitigation]** Rely on existing CI tests to catch regressions.
