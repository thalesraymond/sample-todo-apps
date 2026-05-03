## 1. Environment and Dependencies

- [x] 1.1 Install `bcrypt` and `@types/bcrypt`.
- [x] 1.2 Install `@fastify/jwt`.
- [x] 1.3 Add `JWT_SECRET` to environment validation in `typescript/src/config/environment.ts`.

## 2. Shared Core and Repository

- [x] 2.1 Create `User` entity type and `UserRepository` interface in `src/shared/types/user.ts`.
- [x] 2.2 Implement `InMemoryUserRepository` in `src/shared/repositories/in-memory-user.repository.ts`.
- [x] 2.3 Write tests for `InMemoryUserRepository`.

## 3. Auth Plugin Update

- [x] 3.1 Register `@fastify/jwt` in app setup (`src/app.ts` or `src/plugins/auth.plugin.ts`).
- [x] 3.2 Update `src/plugins/auth.plugin.ts` to use `request.jwtVerify()` to validate token and populate `request.user`.

## 4. Registration Feature

- [x] 4.1 Create `src/features/auth/register.route.ts` and handler.
- [x] 4.2 Write failing integration test for registration endpoint.
- [x] 4.3 Implement user registration logic (validate input, check existing user, hash password, save user).
- [x] 4.4 Make tests pass.

## 5. Login Feature

- [x] 5.1 Create `src/features/auth/login.route.ts` and handler.
- [x] 5.2 Write failing integration test for login endpoint.
- [x] 5.3 Implement user login logic (find user, verify password, sign JWT, return token).
- [x] 5.4 Make tests pass.
