## Context

The TypeScript project uses Vitest for testing. While coverage reports exist, they don't guarantee that the tests actually validate the logic (e.g., a test might cover a line but lack an assertion that fails if the logic changes). Stryker provides this validation by mutating the code and checking if tests fail.

## Goals / Non-Goals

**Goals:**
- Integrate Stryker with the existing Vitest setup in the `typescript/` project.
- Configure Stryker to use the TypeScript checker for faster runs.
- Automate mutation testing in a nightly GitHub Actions workflow.
- Create a persistent feedback loop via GitHub Issues for surviving mutants.
- Minimize the impact on CI speed by keeping mutation testing out of PR workflows.

**Non-Goals:**
- Reaching 100% mutation score immediately (the goal is visibility and tracking).
- Applying mutation testing to the `client/` or other language directories in this phase.
- Modifying existing tests to kill mutants (this is an implementation task for after this change is applied).

## Decisions

### 1. Stryker Runner: Vitest
**Decision:** Use `@stryker-mutator/vitest-runner`.
**Rationale:** The project already uses Vitest. Stryker's native Vitest runner is the most efficient way to execute tests during mutation.

### 2. Configuration: Incremental and Focused
**Decision:** Enable `incremental` mode in Stryker and focus on `src/` (excluding tests and types).
**Rationale:** Mutation testing is computationally expensive. Incremental mode allows Stryker to skip files that haven't changed, significantly speeding up subsequent runs.

### 3. CI Reporting: GitHub Issues (Parent/Child Pattern)
**Decision:** Use a two-tier issue reporting system.
- One "Global" issue (`mutation-report`) for high-level stats.
- Individual "Mutant" issues (`mutant`) for each specific survivor.
**Rationale:** 
- A single issue with 50 survivors is hard to manage and assign.
- Individual issues allow developers to "claim" a mutant, discuss it, and track its resolution specifically.
- The parent issue provides the management view of the overall trend.

### 4. API Versioning for GitHub Scripts
**Decision:** Use `X-GitHub-Api-Version: 2026-03-10` in scripts.
**Rationale:** Ensures compatibility with the project's simulated date (May 2026) and mimics real-world best practices for using GitHub's REST API.

## Risks / Trade-offs

- **[Risk] Resource Exhaustion in CI** → **Mitigation:** Run only nightly and use incremental mode. Use `ubuntu-latest` which has decent resources.
- **[Risk] Issue Spam** → **Mitigation:** The scripts are designed to *update* existing issues rather than create new ones for every run. It also automatically closes issues when mutants are killed.
- **[Risk] Flaky Tests causing False Positives** → **Mitigation:** Stryker has built-in timeout and retry logic, but the team should ensure Vitest tests are deterministic.
