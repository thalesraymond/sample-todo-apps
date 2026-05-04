## ADDED Requirements

### Requirement: Stryker Integration
The TypeScript project SHALL have Stryker Mutator integrated to enable mutation testing of the source code.

#### Scenario: Running mutation tests locally
- **WHEN** the command `pnpm mutate` is executed in the `typescript/` directory
- **THEN** Stryker SHALL run against the source code and generate a report in `reports/mutation/`

### Requirement: Nightly Mutation CI Workflow
A GitHub Actions workflow SHALL run nightly to execute mutation tests and monitor test quality trends.

#### Scenario: Scheduled nightly run
- **WHEN** the clock reaches midnight (UTC)
- **THEN** the "Mutation Testing (Nightly)" workflow SHALL trigger automatically

### Requirement: Global Mutation Reporting via GitHub Issues
The nightly workflow SHALL create or update a single "parent" GitHub issue to summarize the overall mutation testing results.

#### Scenario: Survivors found in nightly run
- **WHEN** the mutation report contains one or more surviving mutants
- **THEN** the system SHALL create a new GitHub issue with the label `mutation-report` or update an existing open one with the latest statistics (score, total mutants, survivors count)

#### Scenario: No survivors found in nightly run
- **WHEN** the mutation report contains zero surviving mutants AND a `mutation-report` issue is currently open
- **THEN** the system SHALL post a congratulatory comment and close the issue

### Requirement: Individual Mutant Tracking
The nightly workflow SHALL track each unique surviving mutant as an individual GitHub issue to allow granular tracking and assignment of test debt.

#### Scenario: New surviving mutant detected
- **WHEN** a mutant survives that was not previously tracked by an open issue
- **THEN** the system SHALL create a new GitHub issue with the label `mutant` and a title identifying the file, line, and mutator

#### Scenario: Surviving mutant resolved
- **WHEN** a previously tracked mutant is no longer present in the mutation report
- **THEN** the system SHALL comment on and close the corresponding GitHub issue

#### Scenario: Existing surviving mutant persists
- **WHEN** a mutant survives that is already tracked by an open issue
- **THEN** the system SHALL update the issue body to link to the latest workflow run to ensure visibility
