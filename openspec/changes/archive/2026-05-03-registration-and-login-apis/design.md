## Context

The TypeScript backend uses Fastify and is currently without a user persistence layer or authentication logic. The `auth.plugin.ts` already has a placeholder for authentication enforcement but defaults to blocking all non-public routes. We need to implement the actual registration and login logic, including database integration.

## Goals / Non-Goals

**Goals:**
- Implement secure user registration and login endpoints.
- Store user credentials in MongoDB.
- Use JWT for session management.
- Integrate with existing `auth-plugin.ts` (eventually).

**Non-Goals:**
- Implementing UI for registration/login.
- Password reset or email verification (future scope).
- OAuth or third-party login providers.

## Decisions

### 1. Persistence Layer
- **Choice**: Use MongoDB for storing user data.
- **Rationale**: The project already has an `in-memory-mongodb` change proposed, suggesting MongoDB is the intended database.
- **Structure**: A `users` collection with fields: `id`, `email`, `passwordHash`, `createdAt`, `updatedAt`.

### 2. Password Hashing
- **Choice**: `bcryptjs`.
- **Rationale**: Industry standard for secure password hashing in Node.js. It's robust and easy to use.

### 3. Authentication Strategy
- **Choice**: JWT (JSON Web Tokens) using `fastify-jwt`.
- **Rationale**: Stateless authentication is well-suited for APIs. `fastify-jwt` integrates seamlessly with the Fastify ecosystem.

### 4. API Structure
- **Choice**: Follow the existing feature-based folder structure.
- **Path**: `src/features/auth/` containing `auth.handler.ts`, `auth.route.ts`, and `auth.schema.ts`.

## Risks / Trade-offs

- **[Risk]** Plaintext password leak → **[Mitigation]** Use strong hashing with `bcryptjs`.
- **[Risk]** JWT secret leak → **[Mitigation]** Store secret in environment variables, never commit it.
- **[Risk]** No database currently connected → **[Mitigation]** The implementation assumes a MongoDB connection is available or will be provided by the `in-memory-mongodb` change.
