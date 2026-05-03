## ADDED Requirements

### Requirement: User Registration
The system SHALL expose an endpoint to register new users with an email and password.

#### Scenario: Successful Registration
- **WHEN** valid email and password are provided
- **THEN** a new user is created and a success response is returned without the password

#### Scenario: Duplicate Registration
- **WHEN** an email that already exists is provided
- **THEN** an error response is returned indicating the user already exists

#### Scenario: Invalid Registration Data
- **WHEN** an invalid email or missing password is provided
- **THEN** a validation error response is returned

### Requirement: User Login
The system SHALL expose an endpoint to authenticate users and return a valid JWT.

#### Scenario: Successful Login
- **WHEN** valid credentials (email and password) are provided
- **THEN** a JWT token is returned in the response

#### Scenario: Invalid Login Credentials
- **WHEN** invalid credentials are provided (wrong password or unknown user)
- **THEN** a 401 Unauthorized response is returned

### Requirement: Secure Password Storage
The system SHALL securely hash passwords before storage.

#### Scenario: Password Hashing
- **WHEN** a new user is created
- **THEN** the password MUST be stored as a hash and never in plaintext
