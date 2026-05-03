# Design: Propose To Do APIs

## Overview
The To Do APIs will be built using Fastify in TypeScript, following a layered architecture as per the project's AGENTS.md guidelines. The architecture will separate concerns into HTTP endpoints, Business Logic (Use Cases), and Data Persistence (Repository).

## Architecture
- **Framework:** Fastify v5
- **Language:** TypeScript
- **Testing:** Vitest for unit and integration testing.
- **Layers:**
  - `HTTP Layer:` Defines Fastify routes for endpoints (`POST /todos`, `GET /todos`, `GET /todos/:id`, `PUT /todos/:id`, `DELETE /todos/:id`).
  - `Use Cases:` Contains the core business logic (e.g., ensuring a todo's title is not empty, enforcing object calisthenics).
  - `Repository:` An interface for data access. An in-memory implementation will be provided initially for testing and rapid development.
  - `Domain:` Value objects (e.g., `TodoId`, `TodoTitle`) and the `Todo` entity itself.

## Endpoints
1. `POST /todos` - Create a new To Do item. Requires a `title`.
2. `GET /todos` - Retrieve a list of all To Do items.
3. `GET /todos/:id` - Retrieve a specific To Do item by its ID.
4. `PUT /todos/:id` - Update a specific To Do item (e.g., change title, mark as complete).
5. `DELETE /todos/:id` - Delete a specific To Do item by its ID.

## Data Models
**Todo**
- `id` (TodoId, UUID)
- `title` (TodoTitle, String)
- `completed` (Boolean)
- `createdAt` (Date)
- `updatedAt` (Date)

## Testing Strategy
- Strict Test-Driven Development (TDD) will be followed.
- Integration tests will cover all HTTP endpoints using a test server instance.
- Unit tests will cover domain logic and use cases.
- Mocking will only be used at the repository boundary if necessary (or an in-memory repository will be used).
- Target >90% test coverage.
