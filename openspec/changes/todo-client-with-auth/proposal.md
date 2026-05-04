## Why

The current React client is a placeholder that only verifies basic API connectivity. This change aims to build a functional To Do application with user authentication (registration and login) to demonstrate a complete end-to-end flow using the existing TypeScript backend.

## What Changes

- Implement a multi-view React application in `client/`.
- Add Registration and Login views with form validation.
- Implement an authenticated To Do dashboard for CRUD operations.
- Introduce a reusable component library for common UI elements (Buttons, Inputs, Cards).
- Implement client-side session management (JWT storage and auto-logout on expiry).
- Update the API client to handle authenticated requests and token injection.

## Capabilities

### New Capabilities
- `todo-client-auth`: Provides user registration and login functionality in the UI, including state management for authentication.
- `todo-client-dashboard`: Provides the main interface for managing To Do items, including creating, listing, updating, and deleting.
- `todo-client-ui-lib`: A set of reusable React components and design patterns to ensure consistency and modularity.

### Modified Capabilities
- `client-react`: Update the base React application to support routing and global state management.

## Impact

- **UI/UX**: Transition from a single-page placeholder to a multi-view application.
- **API Connectivity**: All requests to To Do endpoints will now include JWT headers.
- **Dependencies**: Addition of `react-router-dom` for navigation and potentially a state management library (or Context API).
- **Structure**: Reorganizing `client/src` into `components`, `views`, `hooks`, and `services`.
