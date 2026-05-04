## Context

The application is a Fastify-based Node.js API. It currently uses several plugins for cross-cutting concerns (CORS, Helmet, Rate Limiting). API documentation is currently non-existent, making it difficult for consumers to understand available endpoints and their expected schemas.

## Goals / Non-Goals

**Goals:**
- Provide interactive API documentation at `/docs`.
- Automatically generate OpenAPI 3.0.x specifications from Fastify route schemas.
- Ensure the documentation is always in sync with the actual implementation.

**Non-Goals:**
- Manually writing OpenAPI YAML/JSON files.
- Implementing authentication for the documentation endpoint in this phase.

## Decisions

- **Framework**: Use `@fastify/swagger` and `@fastify/swagger-ui`.
  - *Rationale*: These are the standard, community-supported plugins for OpenAPI generation in the Fastify ecosystem. They integrate seamlessly with Fastify's schema-based routing.
- **Architecture**: Implement as a dedicated plugin in `src/plugins/swagger.plugin.ts`.
  - *Rationale*: Maintains consistency with the existing architecture where middleware and integrations are encapsulated in plugins.
- **Configuration**:
  - Swagger UI will be hosted at `/docs`.
  - OpenAPI specification will be available at `/docs/json`.
  - Static configuration for Swagger (title, version, etc.) will be hardcoded in the plugin for now, with the potential to move to environment variables later.

## Risks / Trade-offs

- **Risk**: API documentation might expose sensitive internal structure or unimplemented features if route schemas are overly verbose or incorrect.
  - *Mitigation*: Review route schemas to ensure they only expose intended information.
- **Trade-off**: Generating documentation at runtime adds a slight overhead to application startup time.
  - *Mitigation*: This is a one-time cost during startup and is negligible compared to the benefits of always-in-sync documentation.
