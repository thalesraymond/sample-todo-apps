## 1. Setup

- [x] 1.1 Create the `.github` directory if it doesn't exist.
- [x] 1.2 Create the `.github/dependabot.yml` file.

## 2. Configuration

- [x] 2.1 Define `version: 2` in the configuration file.
- [x] 2.2 Add an entry to `updates` for the `typescript/` project.
- [x] 2.3 Set `package-ecosystem: npm` to track pnpm dependencies.
- [x] 2.4 Set `directory: /typescript` to target the TypeScript package.
- [x] 2.5 Configure the update schedule for weekly intervals (Mondays).
- [x] 2.6 Set `open-pull-requests-limit: 10`.

## 3. Validation

- [x] 3.1 Verify the YAML syntax of the `.github/dependabot.yml` file.
