## 1. Preparation

- [x] 1.1 Verify local scripts (`build`, `lint`, `format:check`, `test:coverage`) are passing in the `typescript` directory.
- [x] 1.2 Create the `.github/workflows` directory if it doesn't exist.

## 2. CI Workflow Implementation

- [x] 2.1 Create `.github/workflows/ci.yml`.
- [x] 2.2 Configure workflow triggers for `push` and `pull_request` on `main`.
- [x] 2.3 Set up the `build-and-test` job with `ubuntu-latest` runner.
- [x] 2.4 Implement the checkout step using `actions/checkout@v4`.
- [x] 2.5 Implement the Node.js setup step using `actions/setup-node@v4` with version 22.
- [x] 2.6 Implement the `pnpm` setup step using `pnpm/action-setup@v4` with version 10.33.2.
- [x] 2.7 Implement the dependency installation step using `pnpm install`.
- [x] 2.8 Implement the build validation step using `pnpm run build`.
- [x] 2.9 Implement the linting and formatting check step using `pnpm run lint` and `pnpm run format:check`.
- [x] 2.10 Implement the test execution and coverage verification step using `pnpm run test:coverage`.

## 3. Verification

- [x] 3.1 Manually verify the YAML syntax of `.github/workflows/ci.yml`.
- [x] 3.2 Commit and push the changes to a branch to verify the workflow triggers and runs successfully on GitHub (if remote is available, otherwise assume success after local YAML validation).
