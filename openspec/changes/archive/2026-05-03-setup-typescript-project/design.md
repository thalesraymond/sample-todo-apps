# Design — Setup TypeScript Todo API Project

## Technology Choices

| Tool        | Choice                                      | Rationale                                                      |
| ----------- | ------------------------------------------- | -------------------------------------------------------------- |
| Runtime     | Node.js LTS (v22+)                          | Required by AGENTS.md — modern, stable, wide ecosystem         |
| Package Mgr | pnpm                                        | User requirement — fast, strict, disk-efficient                |
| Framework   | Fastify v5                                  | Required by AGENTS.md — lightweight, schema-based, fast        |
| Language    | TypeScript 5.x (`strict: true`)             | Required by AGENTS.md — strictest type checking                |
| Testing     | Vitest                                      | Required by AGENTS.md — fast, native TS support, ESM-first     |
| Linting     | ESLint v9 flat config + typescript-eslint    | Required by AGENTS.md — zero warnings policy                  |
| Formatting  | Prettier                                    | User requirement — consistent code style                       |
| Logging     | Fastify built-in Pino                       | Structured logging required by AGENTS.md — Pino is Fastify's default |

## Project Structure

```
typescript/
├── src/
│   ├── app.ts                    # Fastify app factory (creates & configures the instance)
│   ├── server.ts                 # Entry point — starts the server
│   ├── config/
│   │   └── environment.ts        # Env var loading & validation via @fastify/env
│   ├── plugins/
│   │   ├── cors.plugin.ts        # @fastify/cors registration
│   │   ├── helmet.plugin.ts      # @fastify/helmet registration
│   │   ├── rate-limit.plugin.ts  # @fastify/rate-limit registration
│   │   └── auth.plugin.ts        # Basic auth hook skeleton
│   ├── shared/
│   │   ├── errors/
│   │   │   └── http-error.ts     # Centralized HTTP error types & handler
│   │   └── types/
│   │       └── index.ts          # Shared type definitions
│   └── features/
│       └── health/
│           ├── health.route.ts   # GET /health — proves the server works
│           └── health.handler.ts # Handler for the health check
├── tests/
│   ├── setup.ts                  # Global test setup
│   ├── helpers/
│   │   └── test-server.ts        # Helper to build a Fastify instance for testing
│   └── integration/
│       └── health.test.ts        # Integration test for GET /health
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.build.json           # Excludes tests from compilation
├── vitest.config.ts
├── eslint.config.mjs
├── .prettierrc
├── .prettierignore
├── .gitignore
└── README.md
```

### Architecture rationale

The structure follows a **vertical slice** approach where each feature (e.g., `health`, and later `todos`) is a self-contained folder under `src/features/`. Within each slice, the layered architecture from AGENTS.md is respected:

```
Route (HTTP) → Handler/UseCase (Business Logic) → Repository (Persistence)
```

Cross-cutting concerns (errors, types, plugins) live in `src/shared/` and `src/plugins/`.

## Fastify Configuration Details

### App factory (`app.ts`)

A `buildApp()` function that:
1. Creates a Fastify instance with Pino logger configured for structured JSON output
2. Registers security plugins (helmet, cors, rate-limit)
3. Registers the env plugin for config validation
4. Sets up a global error handler that maps errors to consistent JSON responses
5. Registers feature routes (starting with `/health`)
6. Returns the configured instance (does NOT call `.listen()`)

### Security plugins

| Plugin                  | Default Configuration                                     |
| ----------------------- | --------------------------------------------------------- |
| `@fastify/helmet`       | Default headers enabled                                   |
| `@fastify/cors`         | Origin restricted to env var `CORS_ORIGIN` (default `*` for dev) |
| `@fastify/rate-limit`   | 100 requests per minute per IP                            |

### Auth skeleton (`auth.plugin.ts`)

A Fastify plugin that registers an `onRequest` hook. For now it will:
- Skip routes marked with `{ config: { public: true } }`
- Return `401 Unauthorized` for all other routes (placeholder — will be implemented in a future change)

This ensures the auth boundary exists from day one without blocking development of public endpoints.

### Error handling

A centralized `setErrorHandler` on the Fastify instance that:
- Catches Fastify validation errors and returns `400` with details
- Catches custom `HttpError` types and returns the appropriate status
- Catches unexpected errors, logs them, and returns `500 Internal Server Error`
- Always returns a consistent JSON shape: `{ statusCode, error, message }`

### Environment config

Uses `@fastify/env` with a JSON Schema to validate:

| Variable       | Type   | Default     | Description               |
| -------------- | ------ | ----------- | ------------------------- |
| `PORT`         | number | `3000`      | Server listen port        |
| `HOST`         | string | `0.0.0.0`   | Server listen host        |
| `NODE_ENV`     | string | `development` | Runtime environment     |
| `LOG_LEVEL`    | string | `info`      | Pino log level            |
| `CORS_ORIGIN`  | string | `*`         | Allowed CORS origin       |

## Testing Strategy

### Vitest config

- Coverage provider: `v8`
- Coverage threshold: `90%` for lines, branches, functions, statements
- Test file pattern: `tests/**/*.test.ts`
- Global setup: `tests/setup.ts`

### Test helper

A `buildTestServer()` function that calls `buildApp()` and returns the Fastify instance without calling `.listen()`. Tests use `app.inject()` for HTTP-level assertions without needing a real server.

### Initial test

`health.test.ts` — verifies `GET /health` returns `200` with `{ status: "ok" }`.

## Linting & Formatting

### ESLint (flat config — `eslint.config.mjs`)

- Extends: `@eslint/js` recommended + `typescript-eslint` strict
- Ignores: `dist/`, `node_modules/`, `coverage/`
- Custom rules: enforce `no-console` (error), unused vars (error)

### Prettier (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### Scripts

| Script          | Command                                  |
| --------------- | ---------------------------------------- |
| `dev`           | `tsx watch src/server.ts`                |
| `build`         | `tsc -p tsconfig.build.json`             |
| `start`         | `node dist/server.js`                    |
| `test`          | `vitest run`                             |
| `test:watch`    | `vitest`                                 |
| `test:coverage` | `vitest run --coverage`                  |
| `lint`          | `eslint .`                               |
| `lint:fix`      | `eslint . --fix`                         |
| `format`        | `prettier --write .`                     |
| `format:check`  | `prettier --check .`                     |
