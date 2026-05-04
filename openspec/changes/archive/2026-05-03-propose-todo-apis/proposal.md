# Proposal: Propose To Do APIs

## What
Implement a RESTful API for managing To Do items in TypeScript using Fastify.
The API will support standard CRUD operations (Create, Read, Update, Delete).

## Why
This will serve as the reference implementation for the To Do APIs as outlined in the project goals. It will set the foundation for demonstrating standard patterns, TDD, and adherence to Object Calisthenics guidelines in TypeScript.

## Capabilities

### New Capabilities
- `todo-api`: Provides RESTful endpoints for CRUD operations on To Do items.

## Non-goals
- Frontend implementation (this is purely backend APIs).
- Complex authentication (simple auth plugin skeleton is sufficient for now).
- Persistent database integration initially (in-memory storage is acceptable for the first version if tests can verify the logic).
