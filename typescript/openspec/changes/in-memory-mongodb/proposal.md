## Why

Currently, running the Sample Todo App locally requires a running MongoDB instance. This adds overhead and friction for developers wanting to quickly clone and run the app or its tests. Adding an in-memory MongoDB option for development/testing environments would streamline local setup and lower the barrier to entry.

## What Changes

- Introduce `mongodb-memory-server` as a development dependency.
- Create a mechanism to conditionally start the in-memory MongoDB instance based on environment variables (e.g., `NODE_ENV=test` or `USE_IN_MEMORY_DB=true`).
- Update connection logic to connect to the in-memory instance when configured to do so.
- Ensure the in-memory instance is properly stopped/cleaned up when the application or test suite exits.

## Capabilities

### New Capabilities
- `in-memory-db`: Support for using an in-memory MongoDB instance for development and testing environments.

### Modified Capabilities
- (None - existing behavior should remain the same when not using the in-memory option)

## Impact

- Development environment configuration
- Testing environment configuration
- Database connection logic (`src/infrastructure/database` or similar)
- `package.json` dependencies
