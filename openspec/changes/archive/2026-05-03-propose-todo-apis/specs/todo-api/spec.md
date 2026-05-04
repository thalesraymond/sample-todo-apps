## ADDED Requirements

### Requirement: Create To Do
The system SHALL provide an endpoint to create a new To Do item.

#### Scenario: Successful creation
- **WHEN** a POST request is made to `/todos` with a valid title
- **THEN** the system SHALL return 201 Created and the created To Do item

### Requirement: List To Dos
The system SHALL provide an endpoint to retrieve all To Do items.

#### Scenario: Successful retrieval
- **WHEN** a GET request is made to `/todos`
- **THEN** the system SHALL return 200 OK and a list of all To Do items

### Requirement: Get To Do by ID
The system SHALL provide an endpoint to retrieve a specific To Do item by its unique identifier.

#### Scenario: Successful retrieval by ID
- **WHEN** a GET request is made to `/todos/{id}` with a valid existing ID
- **THEN** the system SHALL return 200 OK and the corresponding To Do item

#### Scenario: To Do not found
- **WHEN** a GET request is made to `/todos/{id}` with a non-existent ID
- **THEN** the system SHALL return 404 Not Found

### Requirement: Update To Do
The system SHALL provide an endpoint to update an existing To Do item's title or completion status.

#### Scenario: Successful update
- **WHEN** a PUT request is made to `/todos/{id}` with updated data
- **THEN** the system SHALL return 200 OK and the updated To Do item

### Requirement: Delete To Do
The system SHALL provide an endpoint to remove a To Do item.

#### Scenario: Successful deletion
- **WHEN** a DELETE request is made to `/todos/{id}`
- **THEN** the system SHALL return 204 No Content
