# 📋 Sample Todo Apps

A collection of **Todo List backend APIs** built in multiple programming languages. Each implementation follows the same specification, serving as a side-by-side reference for idiomatic patterns, recommended practices, and architectural decisions across different tech stacks.

## Purpose

This repository exists to:

- **Compare languages** — See how the same domain (a simple Todo CRUD API) is expressed in Go, TypeScript, C#, Ruby, and more.
- **Serve as a reference** — Quickly recall how to structure a project, write tests, handle errors, and apply SOLID principles in each language.
- **Enforce quality standards** — Every implementation follows a strict set of guidelines (see [AGENTS.md](./AGENTS.md)) including TDD, ≥ 90 % test coverage, and object calisthenics.

## Implementations

| Language | Directory | Status |
| ---------- | ---------------------- | ------ |
| Go | [`go/`](./go) | 🚧 |
| TypeScript | [`typescript/`](./typescript) | 🚧 |
| C# | [`csharp/`](./csharp) | 🚧 |
| Ruby | [`ruby/`](./ruby) | 🚧 |

> More languages may be added over time.

## API Specification

Every implementation exposes the same RESTful API:

| Method | Endpoint | Description |
| -------- | --------------- | -------------------------------- |
| `GET` | `/todos` | List all todos |
| `GET` | `/todos/:id` | Get a single todo by ID |
| `POST` | `/todos` | Create a new todo |
| `PUT` | `/todos/:id` | Update an existing todo |
| `DELETE` | `/todos/:id` | Delete a todo |

### Todo Resource

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "completed": false,
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

## Getting Started

Each language directory is a self-contained project with its own dependency management, build tooling, and test suite. Refer to the `README.md` inside each directory for setup instructions.

```bash
# Example: running the Go implementation
cd go/
# follow the local README
```

## Guidelines

All implementations must follow the rules defined in **[AGENTS.md](./AGENTS.md)**, which covers:

- Test-Driven Development (TDD)
- ≥ 90 % code coverage
- SOLID principles
- Object Calisthenics
- Language-specific best practices
## License


MIT
