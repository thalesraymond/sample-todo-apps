## 1. Setup and Project Organization

- [ ] 1.1 Install `react-router-dom` in `client/`.
- [ ] 1.2 Create the directory structure: `src/components`, `src/features`, `src/hooks`, `src/services`, `src/views`.
- [ ] 1.3 Move the existing `api.ts` to `src/services/api.ts` and refactor it as a base service.

## 2. Reusable Component Library (UI Lib)

- [ ] 2.1 Implement `Button` component in `src/components/ui/Button.tsx`.
- [ ] 2.2 Implement `Input` component in `src/components/ui/Input.tsx`.
- [ ] 2.3 Implement `Card` component in `src/components/ui/Card.tsx`.
- [ ] 2.4 Add global CSS variables for the design system in `src/index.css`.

## 3. Authentication Feature

- [ ] 3.1 Implement `AuthContext` and `useAuth` hook in `src/hooks/useAuth.ts`.
- [ ] 3.2 Create the `AuthService` in `src/services/auth.service.ts` for registration and login API calls.
- [ ] 3.3 Implement `LoginView` and `RegisterView` in `src/views/auth/`.
- [ ] 3.4 Implement an `AuthGuard` component to protect dashboard routes.

## 4. To Do Dashboard Feature

- [ ] 4.1 Create `TodoService` in `src/services/todo.service.ts` for CRUD operations.
- [ ] 4.2 Implement `TodoItem` and `TodoForm` components in `src/features/todos/`.
- [ ] 4.3 Implement `DashboardView` in `src/views/dashboard/DashboardView.tsx`.
- [ ] 4.4 Integrate the To Do list with the backend API and handle real-time UI updates.

## 5. Routing and Final Integration

- [ ] 5.1 Configure the main `App.tsx` with `BrowserRouter` and routes for Auth and Dashboard.
- [ ] 5.2 Implement a global navigation header with logout functionality.
- [ ] 5.3 Write unit tests for the UI components and auth hooks using Vitest.
- [ ] 5.4 Run a final build and verify the end-to-end user flow.
