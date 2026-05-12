# 📋 Todo API — TypeScript / Fastify

A RESTful Todo List API built with **Fastify v5** and **TypeScript**, following strict TDD, SOLID principles, and object calisthenics as defined in [AGENTS.md](../AGENTS.md).

## Prerequisites

- **Node.js** ≥ 22 (LTS recommended)
- **pnpm** ≥ 10

## Getting Started

### Installation

```bash
pnpm install
```

### Running the Dev Server

```bash
pnpm dev
```

The server starts at `http://localhost:3000` by default. Verify it's working:

```bash
curl http://localhost:3000/health
# → { "status": "ok" }
```

### Building for Production

```bash
pnpm build
pnpm start
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

Coverage threshold is set to **90%** for lines, branches, functions, and statements.

## Linting & Formatting

```bash
# Check for lint errors
pnpm lint

# Auto-fix lint errors
pnpm lint:fix

# Check formatting
pnpm format:check

# Auto-format all files
pnpm format
```

ESLint is configured with **strict TypeScript rules** and **zero warnings** policy. Prettier handles code formatting with no semicolons and single quotes.

## Project Structure

```
typescript/
├── src/
│   ├── app.ts                    # Fastify app factory
│   ├── server.ts                 # Entry point (starts the server)
│   ├── config/
│   │   └── environment.ts        # Env var validation via @fastify/env
│   ├── plugins/
│   │   ├── auth.plugin.ts        # Auth hook skeleton (401 by default)
│   │   ├── cors.plugin.ts        # CORS configuration
│   │   ├── database.plugin.ts    # MongoDB connection and setup
│   │   ├── helmet.plugin.ts      # Security headers
│   │   ├── rate-limit.plugin.ts  # Request rate limiting
│   │   ├── swagger.plugin.ts     # Swagger / OpenAPI setup
│   │   └── todo.plugin.ts        # Todo domain plugin registration
│   ├── shared/
│   │   └── errors/
│   │       ├── error-handler.ts  # Centralized error handler
│   │       └── http-error.ts     # Typed HTTP error hierarchy
│   └── features/
│       ├── auth/
│       │   ├── auth.handler.ts   # Authentication handler
│       │   └── auth.route.ts     # Auth endpoints
│       ├── health/
│       │   ├── health.handler.ts # Health check handler
│       │   └── health.route.ts   # GET /health (public)
│       └── todo/
│           ├── todo.controller.ts # Todo endpoints controller
│           └── todo.route.ts     # Todo endpoints
├── tests/
│   ├── setup.ts                  # Global test setup
│   ├── helpers/
│   │   └── test-server.ts        # Test Fastify instance builder
│   └── integration/
│       └── health.test.ts        # Health endpoint tests
├── package.json
├── tsconfig.json                 # Strict TypeScript config
├── tsconfig.build.json           # Build-only config (excludes tests)
├── vitest.config.ts              # Test runner + coverage config
├── eslint.config.mjs             # ESLint flat config
├── .prettierrc                   # Prettier settings
└── .prettierignore
```

### Architecture

The project follows a **vertical slice architecture** where each feature is a self-contained folder under `src/features/`. Within each slice, the layered architecture from AGENTS.md applies:

```
Route (HTTP Layer)  →  Handler / Use Case  →  Repository (Persistence)
```

Cross-cutting concerns live in `src/shared/` (errors, types) and `src/plugins/` (security, auth).

## Environment Variables

| Variable           | Type    | Default                              | Description                                 |
| ------------------ | ------- | ------------------------------------ | ------------------------------------------- |
| `PORT`             | number  | `3000`                               | Server listen port                          |
| `HOST`             | string  | `0.0.0.0`                            | Server listen host                          |
| `NODE_ENV`         | string  | `development`                        | Runtime environment                         |
| `LOG_LEVEL`        | string  | `info`                               | Pino log level                              |
| `CORS_ORIGIN`      | string  | `*`                                  | Allowed CORS origin                         |
| `JWT_SECRET`       | string  | `super-secret-key`                   | Secret key for signing JWTs                 |
| `MONGODB_URI`      | string  | `mongodb://localhost:27017/todo-app` | MongoDB connection string                   |
| `USE_IN_MEMORY_DB` | boolean | `true`                               | Use in-memory MongoDB server (for dev/test) |

## Database

By default, the application uses an in-memory MongoDB server for development and testing.

The in-memory server (`mongodb-memory-server`) will download the necessary binaries on the first run, spin up a temporary instance, and automatically shut it down when the application exits.

### Persistent Database

To run the application with a persistent, local MongoDB installation, you can disable the in-memory server and the application will connect to the `MONGODB_URI`:

```bash
export USE_IN_MEMORY_DB=false
export MONGODB_URI=mongodb://localhost:27017/todo-app
pnpm dev
```

## Security Defaults

- **Helmet** — Security headers (XSS protection, clickjacking prevention, etc.)
- **CORS** — Configurable origin via `CORS_ORIGIN` env var
- **Rate Limiting** — 100 requests per minute per IP
- **Auth** — `onRequest` hook rejects unauthenticated requests by default; routes opt into public access with `{ config: { public: true } }`
