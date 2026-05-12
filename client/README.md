# Sample Todo App - Client

This is the frontend client application for the Sample Todo App project. It is built using a modern React stack, communicating with the backend APIs via REST.

## Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Testing:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting:** [ESLint](https://eslint.org/)

## Features

- User Authentication (Login, Registration, JWT-based auth stored via `js-cookie`)
- Route Protection (`AuthGuard`)
- Todo Management (Create, Read, Update, Delete)
- Responsive UI components

## Scripts

This project uses `pnpm` as its package manager. You can run the following scripts:

- `pnpm dev` - Starts the Vite development server.
- `pnpm build` - Type-checks the code and builds the production app.
- `pnpm preview` - Boots up a local static web server that serves the files of the production build (`dist`).
- `pnpm lint` - Runs ESLint to find issues in the code.
- `pnpm test` - Runs the test suite using Vitest in single-run mode.
- `pnpm test:watch` - Runs the test suite in watch mode for active development.

## Project Structure

```text
client/
├── public/          # Static assets (favicon, etc.)
├── src/             # Source code
│   ├── assets/      # Images and other static files
│   ├── components/  # Shared UI components (Button, Input, Card, Header)
│   ├── features/    # Feature-specific components (e.g., todos)
│   ├── hooks/       # Custom React hooks (e.g., useAuth)
│   ├── services/    # API interaction services (api, auth, todo)
│   ├── views/       # Route level components (Dashboard, Login, Register)
│   ├── App.tsx      # Application root and router definition
│   └── main.tsx     # React entry point
├── package.json     # Project dependencies and scripts
└── vite.config.ts   # Vite bundler and Vitest configuration
```

## Running Locally

1. Ensure dependencies are installed:
   ```bash
   pnpm install
   ```
2. Start the development server:
   ```bash
   pnpm dev
   ```

By default, the client expects the backend API to be running on its configured port (typically managed through environment variables or proxy settings during development).
