## Why

We currently have backend APIs implemented across different languages (e.g. TypeScript, and soon Go, C#, Ruby) serving the same Todo API specs. However, there is no frontend to interact with these APIs. We need a frontend to consume the API to serve as a complete reference implementation.

## What Changes

- Create a new React client application in the `client/` directory using Vite.
- Connect the client application to the backend API. Given only `/health` is implemented right now in TypeScript, we'll initially build a simple connection to fetch the health status, laying down the groundwork for the full Todo app when the backend is ready.

## Capabilities

### New Capabilities
- `client-react`: React client application to interact with the backend APIs.

### Modified Capabilities

## Impact

- Adds a new `client/` directory to the repository containing the React app.
- Development processes will include a new frontend setup.
