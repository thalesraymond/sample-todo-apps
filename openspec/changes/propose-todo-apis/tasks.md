# Tasks: Propose To Do APIs

## Task 1: Domain Models and Value Objects
**Goal:** Implement the core domain objects adhering to Object Calisthenics (wrapping primitives).
**Steps:**
1. Create `TodoId` value object.
2. Create `TodoTitle` value object (enforce non-empty string).
3. Create `Todo` entity class using these value objects.
4. Write unit tests for all domain models.

## Task 2: Repository Interface and In-Memory Implementation
**Goal:** Define the persistence boundary and provide a simple implementation for development/testing.
**Steps:**
1. Define `TodoRepository` interface with methods: `save`, `findById`, `findAll`, `delete`.
2. Implement `InMemoryTodoRepository`.
3. Write unit tests verifying repository behavior.

## Task 3: Use Cases
**Goal:** Implement the business logic for standard CRUD operations.
**Steps:**
1. Implement `CreateTodoUseCase`.
2. Implement `GetTodosUseCase` and `GetTodoByIdUseCase`.
3. Implement `UpdateTodoUseCase`.
4. Implement `DeleteTodoUseCase`.
5. Write unit tests for all use cases, utilizing the `InMemoryTodoRepository`.

## Task 4: HTTP Layer (Fastify Routes)
**Goal:** Expose the use cases via RESTful endpoints.
**Steps:**
1. Create `TodoController` or route handlers mapping HTTP requests to Use Cases.
2. Define Fastify routes: `POST /todos`, `GET /todos`, `GET /todos/:id`, `PUT /todos/:id`, `DELETE /todos/:id`.
3. Ensure proper error handling and mapping (e.g., 404 for not found, 400 for validation errors).

## Task 5: Integration Tests
**Goal:** Verify the endpoints using a test server instance.
**Steps:**
1. Setup testing infrastructure (if not already done via vitest).
2. Write integration tests for all endpoints (Red -> Green -> Refactor cycle).
3. Ensure code coverage remains >= 90%.

## Task 6: Final Review and Refactoring
**Goal:** Ensure code adheres to all AGENTS.md guidelines.
**Steps:**
1. Review Object Calisthenics rules (one level of indentation, no `else`, one dot per line, etc.).
2. Run linters (`pnpm lint`) and fix any issues.
3. Verify tests and coverage (`pnpm test:coverage`).
