# AGENTS.md — Development Guidelines

This document defines the mandatory guidelines for every implementation in this repository. All contributors — human or AI — **must** follow these rules without exception.

---

## 1. Test-Driven Development (TDD)

Every feature and bug fix **must** be developed using the Red → Green → Refactor cycle:

1. **Red** — Write a failing test that describes the desired behavior.
2. **Green** — Write the minimum amount of production code to make the test pass.
3. **Refactor** — Improve the code while keeping all tests green.

### Rules

- No production code is written without a corresponding failing test first.
- Tests must be small, focused, and test a single behavior.
- Use descriptive test names that read as specifications (e.g., `should return 404 when todo does not exist`).
- Prefer integration tests for HTTP endpoints and unit tests for domain/business logic.
- Mocking is allowed **only** at boundaries (e.g., database, external services) — never mock the system under test.

---

## 2. Code Coverage

- **Minimum threshold: 90 %** line coverage across the entire project.
- Coverage reports must be generated as part of the CI/test pipeline.
- Coverage must **never** decrease when adding new code.
- Untested code paths must be explicitly justified with a comment if coverage cannot reach them (e.g., platform-specific edge cases).

---

## 3. SOLID Principles

Every implementation must adhere to SOLID:

| Principle | Guideline |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **S** — Single Responsibility | Each class/module/function does one thing. Separate HTTP handling, business logic, and persistence into distinct layers. |
| **O** — Open/Closed | Extend behavior through abstractions (interfaces, traits, protocols), not by modifying existing code. |
| **L** — Liskov Substitution | Subtypes must be substitutable for their base types without altering correctness. |
| **I** — Interface Segregation | Define small, focused interfaces. Consumers should not depend on methods they do not use. |
| **D** — Dependency Inversion | High-level modules depend on abstractions, not concretions. Inject dependencies; do not instantiate them internally. |

### Layered Architecture

All implementations must follow a layered structure:

```
HTTP Layer  →  Use Cases / Services  →  Repository (Persistence)
     ↑               ↑                         ↑
  Frameworks     Domain Logic             Database / Storage
```

- **HTTP Layer** — Route definitions, request parsing, response formatting.
- **Use Cases / Services** — Business rules and orchestration. Framework-agnostic.
- **Repository** — Data access abstraction. The only layer that talks to the database.
- **Domain** — Pure models and value objects. No dependencies on frameworks or infrastructure.

---

## 4. Object Calisthenics

Follow these rules to produce clean, maintainable code:

1. **Only one level of indentation per method.** Extract deeper logic into well-named private methods or separate functions.
2. **Don't use the `else` keyword.** Use early returns, guard clauses, or polymorphism.
3. **Wrap all primitives and strings.** Domain concepts like `TodoId` or `TodoTitle` should be value objects, not raw strings/UUIDs.
4. **First-class collections.** Any class that contains a collection should contain no other member variables.
5. **One dot per line** (Law of Demeter). Don't chain calls across object boundaries — talk to your immediate collaborators only.
6. **Don't abbreviate.** Use full, descriptive names (`completedAt`, not `compAt`).
7. **Keep all entities small.** Classes ≤ 50 lines, methods ≤ 10 lines (soft guideline — prioritize clarity).
8. **No classes with more than two instance variables.** If you need more, decompose into smaller objects.
9. **No getters/setters/properties** — Tell, don't ask. Push behavior into the objects that own the data.

> **Note:** These are aspirational guidelines. Apply pragmatically — if a rule creates more complexity than it removes, document the deviation with a brief comment explaining why.

---

## 5. Language-Specific Best Practices

Each implementation must use the **latest stable version** of its language and follow the community's current recommended practices.

### Go

- Use the standard library (`net/http` or the `http.ServeMux` introduced in Go 1.22+) — avoid third-party routers unless justified.
- Structure the project following the [Standard Go Project Layout](https://github.com/golang-standards/project-layout) conventions.
- Use `testify` or the standard `testing` package for assertions.
- Run `go vet`, `staticcheck`, and `golangci-lint` with zero warnings.

### TypeScript

- Use a modern runtime (Node.js LTS or Bun) with strict TypeScript configuration (`strict: true`).
- Prefer a lightweight framework (e.g., Fastify, Hono) over heavy ones.
- Use `vitest` for testing.
- Enable ESLint with a strict rule set; zero warnings allowed.

### C\#

- Target the latest .NET LTS release.
- Use Minimal APIs or Controllers with ASP.NET Core.
- Use `xUnit` for testing and `FluentAssertions` for readable assertions.
- Follow Microsoft's [C# coding conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions).

### Ruby

- Use the latest stable Ruby version.
- Prefer a lightweight framework (e.g., Sinatra, Roda, or Hanami) over Rails for this scope.
- Use `RSpec` for testing.
- Follow the [Ruby Style Guide](https://rubystyle.guide/) and enforce it with `RuboCop`.

---

## 6. General Engineering Standards

- **Validation** — Before proceeding to the next task or finishing work, you **must** run all tests, build the project, and execute the linter. Every change is incomplete until its behavioral correctness, structural integrity, and stylistic consistency are verified.
- **Linters** — Every implementation must pass its language's linter with **zero warnings and zero errors**. Never bypass, disable, or suppress linter rules (e.g., no `// nolint`, `// eslint-disable`, `#pragma warning disable`, or `# rubocop:disable`). If a rule conflicts with the codebase, fix the code — do not silence the tool.
- **Conventional Commits** — All commits **must** follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Use small, atomic commits with descriptive messages (e.g., `feat: add create todo endpoint`, `test: add integration tests for delete todo`, `refactor: extract todo repository interface`).
- **No dead code** — Remove unused imports, variables, and functions.
- **Error handling** — Handle all errors explicitly. Never swallow exceptions or ignore error returns.
- **Logging** — Use structured logging. No `print`/`console.log` in production code.
- **Configuration** — Use environment variables for configuration. No hardcoded secrets or connection strings.
- **Documentation** — Each implementation directory must have its own `README.md` with setup, run, and test instructions.
