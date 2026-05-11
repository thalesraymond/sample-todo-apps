## Context

The TODO application currently has a TypeScript/Node.js backend using Fastify. To provide backend parity, we are implementing a C# version. The existing client uses standard REST patterns and JWT authentication.

## Goals / Non-Goals

**Goals:**
- Implement a C# API that is a drop-in replacement for the TypeScript version.
- Ensure identical endpoint paths, HTTP methods, and status codes.
- Ensure identical request and response JSON schemas.
- Use JWT authentication compatible with the existing client.
- Provide a simple health check endpoint.

**Non-Goals:**
- Implementing a persistent database (PostgreSQL, SQL Server, etc.) at this stage. In-memory storage will be used to match the current default behavior of the TypeScript API.
- Diverging from the current API contract.

## Decisions

### 1. Framework: ASP.NET Core Minimal APIs
**Rationale**: Minimal APIs provide a lightweight approach to building HTTP services, which closely matches the feel and performance characteristics of Fastify in the TypeScript project.
**Alternatives**: Controller-based APIs (overkill for this simple service).

### 2. Authentication: JWT Bearer
**Rationale**: The client already expects JWTs. We will use `Microsoft.AspNetCore.Authentication.JwtBearer` to handle token validation and generation.
**Alternatives**: IdentityServer (too complex for this use case), Cookies (not used by the current client).

### 3. Data Storage: In-Memory Repositories
**Rationale**: The TypeScript project uses in-memory MongoDB or in-memory maps. To minimize external dependencies and ensure parity, we will use singleton-scoped repositories with in-memory collections (`ConcurrentDictionary` or `List`).
**Alternatives**: EF Core with SQLite (adds file system dependency), real MongoDB (adds infrastructure requirement).

### 4. Project Structure
**Rationale**: We will follow a simplified Clean Architecture or a feature-based structure to keep it maintainable yet simple.
- `Features/Auth`: Authentication logic.
- `Features/Todo`: TODO management logic.
- `Models`: Data Transfer Objects (DTOs) and Domain models.
- `Repositories`: Data access logic.

## Risks / Trade-offs

- **[Risk]** JWT Compatibility → **[Mitigation]** Use standard JWT claims (`sub`, `email`) and ensure the signing key matches the expected format.
- **[Risk]** JSON Case Sensitivity → **[Mitigation]** Configure `JsonSerializerOptions` to use `PropertyNamingPolicy = JsonNamingPolicy.CamelCase` (standard in ASP.NET Core).
- **[Risk]** Port Conflict → **[Mitigation]** Default the C# API to a different port (e.g., 5000) or allow configuration via environment variables, same as TypeScript.
