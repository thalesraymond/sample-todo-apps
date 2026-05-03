# Tasks — Setup TypeScript Todo API Project

## Task 1: Initialize pnpm project and TypeScript

**Goal:** Create `package.json`, install TypeScript, configure `tsconfig.json` and `tsconfig.build.json`.

**Steps:**
1. Run `pnpm init` in `typescript/`
2. Install TypeScript and Node.js types: `pnpm add -D typescript @types/node tsx`
3. Create `tsconfig.json` with `strict: true`, ES2022 target, NodeNext module resolution
4. Create `tsconfig.build.json` extending base, excluding `tests/`
5. Create `.gitignore` for `node_modules/`, `dist/`, `coverage/`

**Verification:** `pnpm exec tsc --noEmit` exits with 0.

---

## Task 2: Install and configure Fastify with security plugins

**Goal:** Set up Fastify v5 with helmet, cors, rate-limit, env, and structured logging.

**Steps:**
1. Install Fastify and plugins: `pnpm add fastify @fastify/helmet @fastify/cors @fastify/rate-limit @fastify/env`
2. Create `src/config/environment.ts` — env schema and types
3. Create `src/plugins/helmet.plugin.ts`
4. Create `src/plugins/cors.plugin.ts`
5. Create `src/plugins/rate-limit.plugin.ts`
6. Create `src/app.ts` — app factory registering all plugins

**Verification:** App builds without errors. Manually testable with `pnpm dev` once server.ts exists.

---

## Task 3: Create error handling infrastructure

**Goal:** Centralized HTTP error types and Fastify error handler.

**Steps:**
1. Create `src/shared/errors/http-error.ts` — `HttpError` class with statusCode + message
2. Wire `setErrorHandler` in `app.ts` — maps validation errors, HttpErrors, and unknown errors to consistent JSON

**Verification:** Unit test for error handler behavior.

---

## Task 4: Create auth plugin skeleton

**Goal:** Wire an `onRequest` hook that enforces auth by default, skips public routes.

**Steps:**
1. Create `src/plugins/auth.plugin.ts` — registers hook, checks `routeOptions.config.public`
2. Register in `app.ts`

**Verification:** Integration test showing public routes bypass auth, non-public routes get 401.

---

## Task 5: Create health check feature

**Goal:** A working `GET /health` endpoint proving the server is operational.

**Steps:**
1. Create `src/features/health/health.handler.ts`
2. Create `src/features/health/health.route.ts` — registers `GET /health` as public
3. Register the route in `app.ts`

**Verification:** Integration test for `GET /health` → 200 `{ status: "ok" }`.

---

## Task 6: Create server entry point

**Goal:** `src/server.ts` that starts the Fastify server.

**Steps:**
1. Create `src/server.ts` — imports `buildApp`, calls `.listen()` with env config
2. Add `dev` and `start` scripts to `package.json`

**Verification:** `pnpm dev` starts the server, `curl localhost:3000/health` returns 200.

---

## Task 7: Configure Vitest

**Goal:** Testing infrastructure with coverage thresholds.

**Steps:**
1. Install: `pnpm add -D vitest @vitest/coverage-v8`
2. Create `vitest.config.ts` with coverage settings (90% threshold)
3. Create `tests/setup.ts`
4. Create `tests/helpers/test-server.ts` — `buildTestServer()` helper
5. Create `tests/integration/health.test.ts`
6. Add `test`, `test:watch`, `test:coverage` scripts to `package.json`

**Verification:** `pnpm test` passes. `pnpm test:coverage` shows ≥ 90%.

---

## Task 8: Configure ESLint

**Goal:** Strict linting with zero warnings.

**Steps:**
1. Install: `pnpm add -D eslint @eslint/js typescript-eslint`
2. Create `eslint.config.mjs` — flat config with strict TS rules
3. Add `lint` and `lint:fix` scripts to `package.json`

**Verification:** `pnpm lint` exits with 0 warnings and 0 errors.

---

## Task 9: Configure Prettier

**Goal:** Consistent code formatting.

**Steps:**
1. Install: `pnpm add -D prettier eslint-config-prettier`
2. Create `.prettierrc`
3. Create `.prettierignore`
4. Add `format` and `format:check` scripts to `package.json`

**Verification:** `pnpm format:check` exits with 0.

---

## Task 10: Create local README

**Goal:** Documentation with setup, run, test, and lint instructions specific to this TypeScript implementation.

**Steps:**
1. Create `typescript/README.md` covering:
   - Prerequisites (Node.js LTS, pnpm)
   - Installation (`pnpm install`)
   - Running the dev server (`pnpm dev`)
   - Running tests (`pnpm test`, `pnpm test:coverage`)
   - Linting (`pnpm lint`)
   - Formatting (`pnpm format`)
   - Project structure overview
   - Environment variables

**Verification:** File exists and is accurate.
