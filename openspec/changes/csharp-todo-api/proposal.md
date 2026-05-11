## Why

Currently, the TODO application relies on a TypeScript/Node.js backend. To demonstrate language parity and provide a choice of backend implementations, we need a C# implementation that provides the exact same API surface and behavior. This ensures the client can work with either backend interchangeably.

## What Changes

- Implement a new C# API in the `csharp/` directory.
- Implement Authentication endpoints (`/api/auth/register`, `/api/auth/login`) matching the existing behavior.
- Implement TODO management endpoints (`/todos`) matching the existing behavior.
- Implement Health check endpoint (`/health`) matching the existing behavior.
- Ensure JWT authentication is compatible with the client.
- Ensure response payloads (JSON) are identical to the TypeScript implementation.

## Capabilities

### New Capabilities
- `csharp-todo-api`: A complete C# implementation of the TODO and Auth APIs, following the existing functional requirements.

### Modified Capabilities
- None: This change implements existing requirements in a new language.

## Impact

- `csharp/`: New project directory containing the ASP.NET Core application.
- `client/`: No changes required, but will be used to verify the new API.
