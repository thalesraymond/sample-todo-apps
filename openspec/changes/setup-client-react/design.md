## Architecture

The React application will follow a standard structure created by Vite's React+TS template.
It will use `fetch` for API calls, abstracted into a central `api.ts` file to make swapping out backend URLs or handling global errors easier in the future.

## API Changes

None. This change only consumes existing APIs.

## Data Model Changes

None.

## Security Considerations

Since this is a client application running in the browser, any CORS configuration on the backend must allow requests from the client's development server port (typically 5173). The backend (TypeScript) currently has `CORS_ORIGIN` set to `*` by default.

## Deployment / Rollout

The client application will have its own build command (`npm run build`) which produces static assets.
