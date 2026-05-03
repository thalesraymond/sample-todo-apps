## ADDED Requirements

### Requirement: Configure In-Memory Database
The system SHALL support configuring the application to use an in-memory MongoDB database instead of a remote or local standalone instance.

#### Scenario: Enable via environment variable
- **WHEN** the environment variable `USE_IN_MEMORY_DB` is set to `true`
- **THEN** the system provisions an in-memory MongoDB server and uses its URI for connection instead of any configured `MONGODB_URI`

### Requirement: Graceful Shutdown of In-Memory Database
The system SHALL ensure the in-memory MongoDB server is stopped when the application exits to prevent orphaned processes and memory leaks.

#### Scenario: Application termination
- **WHEN** the application receives a termination signal (e.g., SIGTERM, SIGINT) and an in-memory database is active
- **THEN** the system stops the in-memory database server during the graceful shutdown process before exiting
