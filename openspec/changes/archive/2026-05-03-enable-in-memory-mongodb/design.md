## Context

The TypeScript implementation of the Todo API currently requires a running MongoDB instance. This creates a hurdle for local development and running the test suite. We want to integrate `mongodb-memory-server` to spin up a temporary, in-memory MongoDB instance automatically when needed (e.g., in a test environment or when a specific flag is set).

## Goals / Non-Goals

**Goals:**
- Provide a zero-config MongoDB setup for development and testing.
- Ensure the in-memory instance is automatically managed (started and stopped) by the application.
- Integrate seamlessly with existing database connection logic.

**Non-Goals:**
- Providing persistence across application restarts when using the in-memory option.
- Supporting in-memory databases other than MongoDB.
- Using this for production workloads.

## Decisions

### 1. In-Memory Implementation
- **Choice**: `mongodb-memory-server`
- **Rationale**: It is the industry standard for this purpose in the Node.js ecosystem. It downloads actual MongoDB binaries and runs them, providing high compatibility with the actual MongoDB database.

### 2. Configuration Trigger
- **Choice**: Use the environment variable `USE_IN_MEMORY_DB=true`.
- **Rationale**: This provides an explicit way for developers to opt-in to the in-memory database. We can also default this to `true` when `NODE_ENV=test` to simplify test setup.

### 3. Integration Point
- **Choice**: Intercept the connection logic in `src/config/database.ts` (to be created or modified).
- **Rationale**: Centralizing the database connection logic makes it easier to inject the in-memory URI before the application connects.

### 4. Lifecycle Management
- **Choice**: Use Fastify's `onClose` hook and process-level signal handlers (`SIGINT`, `SIGTERM`).
- **Rationale**: Ensures that the `mongodb-memory-server` is stopped correctly regardless of how the application exits, preventing orphaned MongoDB processes.

## Risks / Trade-offs

- **[Risk]** First-time startup delay → **[Mitigation]** `mongodb-memory-server` downloads binaries on the first run. We can document this so developers aren't surprised by the initial delay.
- **[Risk]** Port conflicts → **[Mitigation]** `mongodb-memory-server` uses a random free port by default.
- **[Risk]** Resource usage → **[Mitigation]** Since it's only for dev/test, the memory usage is acceptable.
