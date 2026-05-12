# C# Todo API

A Todo REST API built with ASP.NET Core Minimal APIs, featuring JWT authentication and in-memory storage.

## Tech Stack

- **Runtime**: .NET 10
- **Framework**: ASP.NET Core Minimal APIs
- **Auth**: JWT Bearer tokens (Microsoft.AspNetCore.Authentication.JwtBearer)
- **Password hashing**: BCrypt.Net-Next
- **Tests**: xUnit + FluentAssertions + Microsoft.AspNetCore.Mvc.Testing

## Project Structure

```
csharp/
├── src/
│   └── TodoApi/
│       ├── Models/          # Domain models (User, Todo)
│       ├── Repositories/    # Data access interfaces + in-memory implementations
│       ├── Services/        # JwtService
│       └── Program.cs       # Minimal API entry point — routes + DI wiring
└── tests/
    └── TodoApi.Tests/       # Integration + unit tests
```

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download) with the **ASP.NET Core** runtime

> If your system only has the base .NET runtime (without ASP.NET Core), install it via the dotnet-install script:
> ```bash
> curl -fsSL https://dot.net/v1/dotnet-install.sh | bash -s -- --channel 10.0 --install-dir ~/.dotnet
> export DOTNET_ROOT=~/.dotnet
> export PATH=~/.dotnet:$PATH
> ```

## Configuration

The application requires a JWT secret of at least 32 characters. Set it via:

| Method | Example |
|---|---|
| `appsettings.json` | `"Jwt": { "Secret": "your-secret-key" }` |
| Environment variable | `Jwt__Secret=your-secret-key` |

The default `appsettings.json` ships a development secret. **Override it in production.**

## Running

```bash
cd src/TodoApi
dotnet run
```

The API starts on `http://localhost:3000` (or `https://localhost:7024` if using the HTTPS profile). Configuration can be found in `Properties/launchSettings.json`.

## API Endpoints

### Auth

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | ❌ | `{ email, password }` | `201 { message, userId }` |
| POST | `/api/auth/login` | ❌ | `{ email, password }` | `200 { token }` |

### Todos

All todo endpoints require a `Authorization: Bearer <token>` header.

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/todos` | — | `200 Todo[]` |
| POST | `/todos` | `{ title }` | `201 Todo` |
| GET | `/todos/:id` | — | `200 Todo` or `404` |
| PUT | `/todos/:id` | `{ title?, completed? }` | `200 Todo` or `404` |
| DELETE | `/todos/:id` | — | `204` or `404` |

### Health

| Method | Path | Response |
|---|---|---|
| GET | `/health` | `200 { status: "ok" }` |

### Todo Shape

```json
{
  "id": "guid",
  "title": "Buy groceries",
  "completed": false,
  "userId": "guid",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Testing

```bash
dotnet test
```

Run with coverage:

```bash
dotnet test --collect:"XPlat Code Coverage" --results-directory ./coverage
```

Tests cover:
- Unit tests for repositories and JWT service
- Integration tests for all HTTP endpoints (auth + todos)
- Unauthenticated access (401)
- Input validation (400)
- Cross-user isolation (user A cannot access user B's todos)
- Not-found scenarios (404)
