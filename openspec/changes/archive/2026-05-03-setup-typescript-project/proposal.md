# Setup TypeScript Todo API Project

## Summary

Scaffold the TypeScript implementation directory (`typescript/`) with all foundational tooling and project structure required to begin feature development of the Todo CRUD API using Fastify.

## Motivation

The repository contains four language-specific directories (Go, TypeScript, C#, Ruby), all currently empty. Before implementing any Todo API features in TypeScript, we need a solid project foundation: package manager, framework, testing, linting, formatting, and a folder structure that follows the repository's architectural guidelines.

This is a **setup-only** change — no business logic, no endpoints, no database. Just the skeleton that future changes will build upon.

## Scope

### In scope

- Initialize pnpm workspace with `package.json` and strict TypeScript config
- Configure Fastify v5 with sane security defaults (helmet, cors, rate-limit, env validation, structured logging)
- Configure a centralized error handler with proper HTTP error responses
- Set up basic auth middleware skeleton (no full implementation — just the hook/plugin wired in)
- Configure Vitest with coverage thresholds (≥ 90%)
- Configure ESLint (flat config) with strict TypeScript rules
- Configure Prettier
- Organize folders following vertical slice architecture aligned with the layered architecture mandated by AGENTS.md
- Create a local `README.md` with setup, run, and test instructions

### Out of scope

- Todo CRUD endpoints
- Database / persistence layer
- CI/CD pipeline
- Docker configuration for the TypeScript service
- Full authentication/authorization implementation
