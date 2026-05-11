## 1. Project Setup

- [ ] 1.1 Initialize ASP.NET Core Web API project in `csharp/` directory
- [ ] 1.2 Add necessary NuGet packages (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- [ ] 1.3 Configure `Program.cs` for Minimal APIs, CORS, and JWT Authentication

## 2. Models and Repositories

- [ ] 2.1 Implement `User` and `Todo` models matching TypeScript schemas
- [ ] 2.2 Implement `IUserRepository` and `ITodoRepository` interfaces
- [ ] 2.3 Implement `InMemoryUserRepository` and `InMemoryTodoRepository` with singleton storage

## 3. Authentication Implementation

- [ ] 3.1 Implement JWT token generation service
- [ ] 3.2 Implement `POST /api/auth/register` endpoint with password hashing (BCrypt)
- [ ] 3.3 Implement `POST /api/auth/login` endpoint
- [ ] 3.4 Configure Authorization policies for protected routes

## 4. TODO Management Implementation

- [ ] 4.1 Implement `GET /todos` endpoint (Authenticated)
- [ ] 4.2 Implement `POST /todos` endpoint (Authenticated)
- [ ] 4.3 Implement `GET /todos/{id}` endpoint (Authenticated)
- [ ] 4.4 Implement `PUT /todos/{id}` endpoint (Authenticated)
- [ ] 4.5 Implement `DELETE /todos/{id}` endpoint (Authenticated)

## 5. System Endpoints

- [ ] 5.1 Implement `GET /health` endpoint

## 6. Verification

- [ ] 6.1 Verify API endpoints manually using `curl` or Postman
- [ ] 6.2 (Optional) Update client environment to point to the C# API and verify integration
