## 1. Local Setup and Dependencies

- [ ] 1.1 Install Stryker dependencies (`@stryker-mutator/core`, `@stryker-mutator/typescript-checker`, `@stryker-mutator/vitest-runner`) in the `typescript/` project.
- [ ] 1.2 Create `typescript/stryker.config.json` with optimized settings (Vitest runner, TypeScript checker, incremental mode).
- [ ] 1.3 Add `mutate` script to `typescript/package.json`.
- [ ] 1.4 Verify local mutation run: execute `pnpm mutate` and ensure it produces a report in `reports/mutation/`.

## 2. GitHub Actions Workflow

- [ ] 2.1 Create `.github/workflows/mutation-testing-nightly.yml`.
- [ ] 2.2 Configure the workflow with `schedule` (cron: `0 0 * * *`) and `workflow_dispatch`.
- [ ] 2.3 Implement the job steps: checkout, install pnpm, setup node, install deps, and run `pnpm mutate`.
- [ ] 2.4 Add artifact upload for the full HTML mutation report.
- [ ] 2.5 Implement the "Global Report" script using `actions/github-script` to manage the `mutation-report` issue.
- [ ] 2.6 Implement the "Individual Mutant" script using `actions/github-script` to manage the granular `mutant` issues.

## 3. Verification and Cleanup

- [ ] 3.1 Trigger the workflow manually (via `workflow_dispatch` simulation or actual dispatch if possible) to verify issue creation.
- [ ] 3.2 Ensure `reports/stryker-incremental.json` is correctly cached and restored in the workflow.
- [ ] 3.3 Verify that resolving a mutant locally and re-running the workflow correctly closes the corresponding issue.
