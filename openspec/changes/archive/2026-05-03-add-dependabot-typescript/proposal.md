## Why

The TypeScript project currently lacks automated dependency updates. Adding Dependabot will ensure that dependencies are regularly updated for security and stability without manual intervention.

## What Changes

- Create a Dependabot configuration file at `.github/dependabot.yml`.
- Configure it to track the `typescript/` directory for `npm` (pnpm) updates.
- Set the update schedule and reviewers.

## Capabilities

### New Capabilities
- `dependency-management`: Provides automated dependency updates and security alerts for the project's package managers.

### Modified Capabilities
- None

## Impact

- Affected systems: GitHub repository workflows.
- Developer experience: Automated PRs for dependency updates.
