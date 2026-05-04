## ADDED Requirements

### Requirement: User Registration
The system SHALL provide a POST `/api/auth/register` endpoint to allow new users to create an account by providing an email and password.

#### Scenario: Successful Registration
- **WHEN** a valid email and a strong password are provided
- **THEN** the system SHALL create a new user record and return a 201 Created status with a success message

#### Scenario: Registration with Existing Email
- **WHEN** an email that is already registered is provided
- **THEN** the system SHALL return a 400 Bad Request status with an error message indicating the email is taken

### Requirement: User Login
The system SHALL provide a POST `/api/auth/login` endpoint to allow existing users to authenticate by providing their registered email and password.

#### Scenario: Successful Login
- **WHEN** valid credentials are provided
- **THEN** the system SHALL return a 200 OK status with a JSON Web Token (JWT)

#### Scenario: Login with Invalid Credentials
- **WHEN** an incorrect email or password is provided
- **THEN** the system SHALL return a 401 Unauthorized status with an error message

### Requirement: Password Security
The system SHALL store user passwords in a hashed format using a strong hashing algorithm (e.g., bcrypt).

#### Scenario: Password Hashing
- **WHEN** a user registers or changes their password
- **THEN** the system SHALL hash the password before saving it to the database
