## ADDED Requirements

### Requirement: Interactive API Documentation
The system SHALL host an interactive Swagger UI to allow developers to discover and test API endpoints.

#### Scenario: Accessing Swagger UI
- **WHEN** a user navigates to the `/docs` endpoint in a web browser
- **THEN** the system SHALL render the Swagger UI interface.

### Requirement: OpenAPI Specification Generation
The system SHALL automatically generate a valid OpenAPI 3.0 specification document derived from the application's route schemas.

#### Scenario: Retrieving OpenAPI JSON
- **WHEN** a user requests the `/docs/json` endpoint
- **THEN** the system SHALL return a JSON object conforming to the OpenAPI 3.0.x specification.
