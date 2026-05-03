## Context

The TypeScript implementation of the Todo API currently requires a running MongoDB instance. This creates a hurdle for local development and running the test suite. We want to integrate `mongodb-memory-server` to spin up a temporary, in-memory MongoDB instance automatically when needed (e.g., in a test environment or when a specific flag is set).

## Goals / Non-Goals

**Goals:**
- Provide a zero-setup local development experience by using an in-memory database.
- Automatically use the in-memory database during tests without requiring a dedicated testing database instance.
- Allow developers to explicitly opt-in or opt-out of the in-memory database using environment variables.

**Non-Goals:**
- Replacing the production database setup.
- Providing in-memory alternatives for other languages/implementations in this repository (this is scoped to TypeScript only).
- Seeding the in-memory database with complex initial data (basic seed might be okay if needed for tests, but full mock data is not the goal).

## Decisions

- **Dependency**: We will use `mongodb-memory-server` as it is the standard and most reliable library for this purpose in the Node.js ecosystem. It downloads the actual MongoDB binaries and runs them in a temporary directory, providing a highly compatible experience.
- **Configuration Strategy**:
  - We will use an environment variable `USE_IN_MEMORY_DB=true` to explicitly enable it.
  - Alternatively, if `NODE_ENV=test`, we might want to default it to true, but explicit is better than implicit. We will start by requiring an explicit `USE_IN_MEMORY_DB=true` or similar flag, or perhaps `MONGODB_URI` being empty will trigger the fallback to in-memory. Let's decide on: If `USE_IN_MEMORY_DB=true` is set, we start the memory server and override the connection string.
- **Integration Point**: The database connection logic (likely where `mongoose.connect` or the MongoDB driver connection happens) will be modified to intercept the connection process, start the `mongodb-memory-server` if configured, and use its generated URI.
- **Lifecycle Management**: The server must be cleanly shut down when the application stops (handling `SIGINT`, `SIGTERM`) or after tests finish to avoid orphaned MongoDB processes.

## Risks / Trade-offs

- **Risk**: `mongodb-memory-server` downloads MongoDB binaries on first run, which can take time and requires internet access.
  - *Mitigation*: It caches the binaries. CI environments might need caching configured to avoid downloading it on every run.
- **Risk**: Orphaned processes if the app crashes without running cleanup logic.
  - *Mitigation*: Ensure graceful shutdown hooks are properly implemented. `mongodb-memory-server` also has some built-in mechanisms to self-terminate, but explicit cleanup is better.
