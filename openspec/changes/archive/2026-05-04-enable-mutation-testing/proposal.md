## Why

The project currently relies on standard unit and integration tests, but there is no objective measure of how effective these tests are at catching bugs. By introducing Stryker mutation testing, we can identify "surviving mutants" (code changes that aren't caught by tests), providing a clear path to improving test quality and coverage. A nightly automated process ensures that test regressions are caught and tracked as GitHub issues, making quality visible and actionable.

## What Changes

- Add Stryker mutation testing tool to the TypeScript project.
- Create a configuration file for Stryker to optimize mutation runs.
- Add a `mutate` script to `package.json`.
- Implement a nightly GitHub Actions workflow that:
    - Runs mutation tests.
    - Reports the mutation score and surviving mutants.
    - Automatically opens, updates, or closes GitHub issues based on surviving mutants to track fixes.

## Capabilities

### New Capabilities
- `mutation-testing`: Integration of Stryker and nightly reporting workflow to track and improve test effectiveness.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- **Build Pipeline**: Adds a new nightly workflow. Does not impact standard PR/CI runs to keep them fast.
- **Dependencies**: Adds `@stryker-mutator/core`, `@stryker-mutator/typescript-checker`, and `@stryker-mutator/vitest-runner` to the TypeScript project's devDependencies.
- **Project Governance**: Introduces automated issue creation for test debt.
