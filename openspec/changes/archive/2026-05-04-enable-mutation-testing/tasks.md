## 1. Local Setup and Dependencies

- [x] 1.1 Install Stryker dependencies (`@stryker-mutator/core`, `@stryker-mutator/typescript-checker`, `@stryker-mutator/vitest-runner`) in the `typescript/` project.
- [x] 1.2 Create `typescript/stryker.config.json` with optimized settings (Vitest runner, TypeScript checker, incremental mode).
- [x] 1.3 Add `mutate` script to `typescript/package.json`.
- [x] 1.4 Verify local mutation run: execute `pnpm mutate` and ensure it produces a report in `reports/mutation/`.

## 2. GitHub Actions Workflow

- [x] 2.1 Create `.github/workflows/mutation-testing-nightly.yml`.
- [x] 2.2 Configure the workflow with `schedule` (cron: `0 0 * * *`) and `workflow_dispatch`.
- [x] 2.3 Implement the job steps: checkout, install pnpm, setup node, install deps, and run `pnpm mutate`.
- [x] 2.4 Add artifact upload for the full HTML mutation report.
- [x] 2.5 Implement the "Global Report" script using `actions/github-script` to manage the `mutation-report` issue.
- [x] 2.6 Implement the "Individual Mutant" script using `actions/github-script` to manage the granular `mutant` issues.

## 3. Verification and Cleanup

- [x] 3.1 Trigger the workflow manually (via `workflow_dispatch` simulation or actual dispatch if possible) to verify issue creation.
- [x] 3.2 Ensure `reports/stryker-incremental.json` is correctly cached and restored in the workflow.
- [x] 3.3 Verify that resolving a mutant locally and re-running the workflow correctly closes the corresponding issue.
