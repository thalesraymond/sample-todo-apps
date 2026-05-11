using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Repositories;
using TodoApi.Services;
using TodoApi.Models;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS to allow cross-origin requests
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure JSON serialization to match TypeScript (camelCase)
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

// Configure DI
builder.Services.AddSingleton<IUserRepository, InMemoryUserRepository>();
builder.Services.AddSingleton<ITodoRepository, InMemoryTodoRepository>();

var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "my_super_secret_key_that_is_at_least_32_characters_long!";
builder.Services.AddSingleton(new JwtService(jwtSecret));

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.ASCII.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = System.TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

var api = app.MapGroup("/api/auth");

api.MapPost("/register", async (RegisterRequest req, IUserRepository userRepo, HttpResponse response) =>
{
    if (string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
    {
        response.StatusCode = 400;
        return Results.Json(new { message = "Email and password are required" }, statusCode: 400);
    }

    if (userRepo.GetUserByEmail(req.Email) != null)
    {
        response.StatusCode = 400;
        return Results.Json(new { message = "Email already registered" }, statusCode: 400);
    }

    var user = new User
    {
        Id = System.Guid.NewGuid().ToString(),
        Email = req.Email,
        Password = BCrypt.Net.BCrypt.HashPassword(req.Password)
    };

    userRepo.AddUser(user);

    return Results.Json(new { message = "User registered successfully", userId = user.Id }, statusCode: 201);
});

api.MapPost("/login", async (LoginRequest req, IUserRepository userRepo, JwtService jwtService, HttpResponse response) =>
{
    if (string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
    {
        response.StatusCode = 400;
        return Results.Json(new { message = "Email and password are required" }, statusCode: 400);
    }

    var user = userRepo.GetUserByEmail(req.Email);
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
    {
        response.StatusCode = 401;
        return Results.Json(new { message = "Invalid credentials" }, statusCode: 401);
    }

    var token = jwtService.GenerateToken(user.Id, user.Email);
    return Results.Json(new { token });
});

var todosApi = app.MapGroup("/todos").RequireAuthorization();

todosApi.MapGet("/", (System.Security.Claims.ClaimsPrincipal user, ITodoRepository todoRepo) =>
{
    var userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    var todos = todoRepo.GetTodosByUserId(userId);
    return Results.Ok(todos);
});

todosApi.MapPost("/", (TodoRequest req, System.Security.Claims.ClaimsPrincipal user, ITodoRepository todoRepo) =>
{
    var userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    var now = System.DateTime.UtcNow;
    var todo = new Todo
    {
        Id = System.Guid.NewGuid().ToString(),
        Title = req.Title,
        Completed = false,
        UserId = userId,
        CreatedAt = now,
        UpdatedAt = now
    };

    todoRepo.AddTodo(todo);
    return Results.Created($"/todos/{todo.Id}", todo);
});

todosApi.MapGet("/{id}", (string id, System.Security.Claims.ClaimsPrincipal user, ITodoRepository todoRepo) =>
{
    var userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    var todo = todoRepo.GetTodoById(id);
    if (todo == null || todo.UserId != userId) return Results.NotFound();

    return Results.Ok(todo);
});

todosApi.MapPut("/{id}", (string id, UpdateTodoRequest req, System.Security.Claims.ClaimsPrincipal user, ITodoRepository todoRepo) =>
{
    var userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    var todo = todoRepo.GetTodoById(id);
    if (todo == null || todo.UserId != userId) return Results.NotFound();

    todo.Title = req.Title ?? todo.Title;
    if (req.Completed.HasValue) todo.Completed = req.Completed.Value;
    todo.UpdatedAt = System.DateTime.UtcNow;

    todoRepo.UpdateTodo(todo);
    return Results.Ok(todo);
});

todosApi.MapDelete("/{id}", (string id, System.Security.Claims.ClaimsPrincipal user, ITodoRepository todoRepo) =>
{
    var userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    var todo = todoRepo.GetTodoById(id);
    if (todo == null || todo.UserId != userId) return Results.NotFound();

    todoRepo.DeleteTodo(id);
    return Results.NoContent();
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);
public record TodoRequest(string Title);
public record UpdateTodoRequest(string? Title, bool? Completed);

public partial class Program { }
