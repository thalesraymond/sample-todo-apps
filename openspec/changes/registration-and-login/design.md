## Context

The system currently lacks authentication. All routes are either unauthenticated or stubbed out. To allow users to securely manage their own Todo items, we need a standard user registration and login mechanism. We are using Fastify for the backend and have an in-memory repository structure that we will extend for users.

## Goals / Non-Goals

**Goals:**
- Implement user registration (email, password).
- Implement secure password hashing.
- Implement user login yielding a JWT.
- Protect routes by validating the JWT.

**Non-Goals:**
- OAuth/SSO integrations.
- Password reset/recovery functionality.
- Email verification loops.

## Decisions

- **Password Hashing:** Use `bcrypt` (or `argon2` if preferred) for secure password hashing. We will choose `bcrypt` for its maturity and ease of use in the Node ecosystem.
- **Token Generation:** Use JSON Web Tokens (JWT) for stateless authentication. We will use `@fastify/jwt` to easily integrate JWT signing and verification into our Fastify server.
- **Repository Structure:** Create an `InMemoryUserRepository` following the same pattern as existing repositories to store user entities. It will implement a `UserRepository` interface.
- **User Entity:** `id` (string/UUID), `email` (string), `passwordHash` (string).

## Risks / Trade-offs

- **Risk:** In-memory storage means users are lost on server restart.
  - **Mitigation:** Acceptable for now as this is a sample/reference app. A persistent DB adapter can be implemented later behind the same interface.
- **Risk:** Storing tokens on client side (XSS).
  - **Mitigation:** We'll return the token in the JSON response payload. The frontend will be responsible for secure storage. In a real-world scenario we might prefer `HttpOnly` cookies, but a Bearer token is simpler and standard for this kind of API.
