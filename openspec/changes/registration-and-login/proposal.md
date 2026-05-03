## Why

Users need a secure way to create an account and authenticate themselves so that they can manage their own personal Todo items securely. Without registration and login, the API cannot uniquely identify users or protect their data.

## What Changes

- Add user registration endpoint to create new users with an email and password.
- Add user login endpoint to authenticate users and issue a JWT for subsequent requests.
- Implement secure password hashing before storing user credentials.
- Update the default authentication plugin to validate JWTs for protected routes.

## Capabilities

### New Capabilities
- `user-auth`: Covers user registration, user login, secure credential storage, and JWT token issuance.

### Modified Capabilities

## Impact

- **Database**: Introduction of a User repository and schema/model.
- **API**: Two new endpoints: `POST /api/register` and `POST /api/login`.
- **Security**: The auth plugin will be modified to expect and validate JWTs.
