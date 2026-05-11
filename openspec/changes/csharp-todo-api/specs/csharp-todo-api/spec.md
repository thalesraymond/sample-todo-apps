## ADDED Requirements

### Requirement: C# API Parity
The C# implementation SHALL provide the same endpoints, request payloads, and response payloads as the TypeScript implementation to ensure full compatibility with the client.

#### Scenario: Verify Endpoint Parity
- **WHEN** the C# API is running
- **THEN** it SHALL expose the following endpoints:
  - `GET /health`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /todos`
  - `POST /todos`
  - `GET /todos/{id}`
  - `PUT /todos/{id}`
  - `DELETE /todos/{id}`

### Requirement: Authentication Compatibility
The C# API SHALL use the same JWT signing and verification logic (or compatible configuration) to allow tokens issued by the API to be used by the client.

#### Scenario: Successful Authentication
- **WHEN** a client provides a valid JWT issued by the C# API in the `Authorization` header
- **THEN** the C# API SHALL authenticate the request and identify the user.

### Requirement: Data Consistency
The C# API SHALL implement the same domain logic for TODO management, including validation and timestamp generation.

#### Scenario: Create TODO
- **WHEN** a POST request is made to `/todos` with a JSON body `{"title": "Test Todo"}`
- **THEN** the system SHALL return 201 Created with a JSON body containing `id`, `title`, `completed` (false), `userId`, `createdAt`, and `updatedAt`.
