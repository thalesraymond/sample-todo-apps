## 1. Domain Models and Value Objects

- [x] 1.1 Create `TodoId` value object in `typescript/src/domain/todo-id.ts`
- [x] 1.2 Create `TodoTitle` value object in `typescript/src/domain/todo-title.ts`
- [x] 1.3 Create `Todo` entity in `typescript/src/domain/todo.ts`
- [x] 1.4 Write unit tests for domain models in `typescript/tests/unit/domain`

## 2. Repository Interface and Implementation

- [x] 2.1 Define `TodoRepository` interface in `typescript/src/domain/todo-repository.ts`
- [x] 2.2 Implement `InMemoryTodoRepository` in `typescript/src/infrastructure/in-memory-todo-repository.ts`
- [x] 2.3 Write unit tests for `InMemoryTodoRepository` in `typescript/tests/unit/infrastructure`

## 3. Use Cases

- [x] 3.1 Implement `CreateTodoUseCase` in `typescript/src/use-cases/create-todo.ts`
- [x] 3.2 Implement `GetTodosUseCase` and `GetTodoByIdUseCase`
- [x] 3.3 Implement `UpdateTodoUseCase`
- [x] 3.4 Implement `DeleteTodoUseCase`
- [x] 3.5 Write unit tests for all use cases

## 4. HTTP Layer (Fastify Routes)

- [x] 4.1 Create `TodoController` or route handlers
- [x] 4.2 Define Fastify routes: `POST /todos`, `GET /todos`, `GET /todos/:id`, `PUT /todos/:id`, `DELETE /todos/:id`
- [x] 4.3 Implement error handling and mapping

## 5. Integration Tests

- [x] 5.1 Setup testing infrastructure
- [x] 5.2 Write integration tests for all endpoints
- [x] 5.3 Ensure code coverage remains >= 90%

## 6. Final Review and Refactoring

- [x] 6.1 Review Object Calisthenics rules
- [x] 6.2 Run linters and fix issues
- [x] 6.3 Verify tests and coverage
