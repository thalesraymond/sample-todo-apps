## 1. Setup Dependencies

- [x] 1.1 Add `mongodb-memory-server` to `devDependencies` in `typescript/package.json`

## 2. Environment Configuration

- [x] 2.1 Update `typescript/src/config/environment.ts` to include `USE_IN_MEMORY_DB` and `MONGODB_URI` schemas.

## 3. Database Plugin Implementation

- [x] 3.1 Create `typescript/src/plugins/database.plugin.ts` to handle MongoDB connection.
- [x] 3.2 Implement logic in `database.plugin.ts` to start `mongodb-memory-server` if `USE_IN_MEMORY_DB` is true.
- [x] 3.3 Ensure `database.plugin.ts` uses the in-memory URI or the configured `MONGODB_URI`.
- [x] 3.4 Register the database plugin in `typescript/src/app.ts`.

## 4. Lifecycle Management

- [x] 4.1 Implement `onClose` hook in the database plugin to stop `mongodb-memory-server` and close connection.

## 5. Verification

- [x] 5.1 Add a health check or a simple test to verify database connection works (both in-memory and regular).
- [x] 5.2 Document the `USE_IN_MEMORY_DB` flag in `typescript/README.md`.
