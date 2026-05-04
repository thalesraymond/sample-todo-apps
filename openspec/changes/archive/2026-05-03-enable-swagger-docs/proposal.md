## Why

The Node.js API currently lacks a centralized, interactive way for developers to explore and test endpoints. Enabling Swagger provides a standardized OpenAPI specification and a user-friendly UI for API discovery, which improves developer productivity and simplifies integration.

## What Changes

- Add `@fastify/swagger` and `@fastify/swagger-ui` as dependencies.
- Configure Fastify to automatically generate OpenAPI 3.0 documentation from existing and future route schemas.
- Expose an interactive Swagger UI at the `/docs` endpoint.

## Capabilities

### New Capabilities
- `api-docs`: Automatic generation and hosting of interactive API documentation using Swagger/OpenAPI.

### Modified Capabilities
- None

## Impact

- Adds new dependencies to `typescript/package.json`.
- Modifies the Fastify server configuration to register swagger plugins.
- Adds a new `/docs` route to the API.
