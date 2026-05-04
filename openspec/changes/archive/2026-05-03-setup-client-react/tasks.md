## Tasks

- [x] 1. **Scaffold React App**: Run `create-vite` to scaffold the React client in `client/` using the `react-ts` template.
- [x] 2. **Install Dependencies**: Install standard dependencies (`npm install`) and testing dependencies (`vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`).
- [x] 3. **Configure Testing**: Update `client/package.json` with a test script and `client/vite.config.ts` with Vitest configuration.
- [x] 4. **API Connectivity Setup**: Create `client/src/api.ts` to export a function that fetches `/health` from `http://localhost:3000`.
- [x] 5. **Update UI**: Modify `client/src/App.tsx` to fetch and display the health status or an error message.
- [x] 6. **Testing**: Write tests in `client/src/App.test.tsx` to verify rendering and API connectivity rendering.