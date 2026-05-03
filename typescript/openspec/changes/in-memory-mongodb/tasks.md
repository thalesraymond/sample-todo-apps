## 1. Setup Dependencies

- [ ] 1.1 Add `mongodb-memory-server` to `devDependencies` in `package.json`

## 2. Environment Configuration

- [ ] 2.1 Update configuration loading (e.g., in `src/config.ts` or similar) to read `USE_IN_MEMORY_DB` boolean flag.

## 3. Database Connection Logic

- [ ] 3.1 Modify the database connection utility (e.g., `src/infrastructure/database.ts` or `src/server.ts`) to intercept the connection.
- [ ] 3.2 If `USE_IN_MEMORY_DB` is true, start the `mongodb-memory-server` and use its generated URI instead of the environment's `MONGODB_URI`.
- [ ] 3.3 Ensure the instance reference to the memory server is kept so it can be shut down later.

## 4. Graceful Shutdown

- [ ] 4.1 Update the application's shutdown hook (where it disconnects from MongoDB) to also stop the `mongodb-memory-server` instance if it was started.

## 5. Testing and Documentation

- [ ] 5.1 Ensure tests run correctly with `USE_IN_MEMORY_DB=true`. Update test setup scripts if necessary to default to this.
- [ ] 5.2 Update `README.md` to document the new `USE_IN_MEMORY_DB` flag and how to use it for local development.
