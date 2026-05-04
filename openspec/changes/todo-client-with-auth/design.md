## Context

The React client currently resides in the `client/` directory and is set up with Vite, TypeScript, and Vitest. The existing implementation is minimal. This design outlines a scalable architecture to support authentication and To Do management, prioritizing component reusability and clean state management.

## Goals / Non-Goals

**Goals:**
- Create a reusable UI component library.
- Implement a robust authentication flow (Login/Register).
- Build a performant To Do dashboard with CRUD capabilities.
- Adhere to the layered architecture (Services -> Hooks -> Components).

**Non-Goals:**
- Full accessibility audit (will use basic aria-labels).
- Complex animations or transitions.
- Offline support/PWA features.

## Decisions

### 1. Component Architecture
- **Atomic Design Principles**: Components will be organized by complexity (Atoms: Button, Input; Molecules: FormField; Organisms: TodoItem, AuthForm).
- **Directory**: `client/src/components/` for shared components, `client/src/features/` for domain-specific components (e.g., `auth/`, `todos/`).

### 2. State Management
- **Choice**: React Context API for Global Auth State + Local State for Forms.
- **Rationale**: Context API is sufficient for basic authentication and user session management without the overhead of Redux or MobX.

### 3. Routing
- **Choice**: `react-router-dom` v6.
- **Rationale**: Industry standard for React routing, providing clear patterns for protected routes (using an `AuthGuard` component).

### 4. API Service Layer
- **Choice**: Axios or Fetch wrapper.
- **Path**: `client/src/services/api.ts`.
- **Logic**: Centralized error handling and automatic JWT injection using interceptors or a custom fetch wrapper.

### 5. Styling
- **Choice**: Vanilla CSS (CSS Modules).
- **Rationale**: Aligns with the project's preference for flexibility and avoiding heavy utility-first frameworks.

## Risks / Trade-offs

- **[Risk]** Security of JWT storage → **[Mitigation]** Use `localStorage` with short-lived tokens and handle expiry gracefully.
- **[Risk]** Prop drilling in dashboard → **[Mitigation]** Use specialized contexts or hooks to provide To Do data where needed.
- **[Risk]** Bundle size growth → **[Mitigation]** Code-splitting views (Register, Login, Dashboard) using `React.lazy`.
