using FluentAssertions;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using TodoApi.Services;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TodoApi.Tests;

public class AuthTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AuthTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public void JwtService_ShouldGenerateValidToken()
    {
        var service = new JwtService("my_super_secret_key_that_is_at_least_32_characters_long!", "TestIssuer", "TestAudience");
        var tokenString = service.GenerateToken("u1", "test@test.com");

        tokenString.Should().NotBeNullOrEmpty();

        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(tokenString);

        token.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value.Should().Be("u1");
        token.Issuer.Should().Be("TestIssuer");
        token.Audiences.Should().Contain("TestAudience");
    }

    [Fact]
    public async Task Register_WithValidData_Returns201()
    {
        var client = _factory.CreateClient();
        var email = $"test{Guid.NewGuid()}@example.com";
        var response = await client.PostAsJsonAsync("/api/auth/register", new { email, password = "Password123" });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("User registered successfully");
        content.GetProperty("userId").GetString().Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Register_WithMissingEmail_Returns400()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/register", new { email = "", password = "Password123" });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("Email and password are required");
    }

    [Fact]
    public async Task Register_WithMissingPassword_Returns400()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/register", new { email = "user@example.com", password = "" });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("Email and password are required");
    }

    [Fact]
    public async Task Register_WithExistingEmail_Returns400()
    {
        var client = _factory.CreateClient();
        var email = $"test{Guid.NewGuid()}@example.com";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password = "Password123" });

        var response = await client.PostAsJsonAsync("/api/auth/register", new { email, password = "Password123" });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("Email already registered");
    }

    [Fact]
    public async Task Login_WithValidData_ReturnsToken()
    {
        var client = _factory.CreateClient();
        var email = $"login{Guid.NewGuid()}@example.com";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password = "Password123" });

        var response = await client.PostAsJsonAsync("/api/auth/login", new { email, password = "Password123" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("token").GetString().Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Login_WithMissingEmail_Returns400()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/login", new { email = "", password = "Password123" });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("Email and password are required");
    }

    [Fact]
    public async Task Login_WithMissingPassword_Returns400()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/login", new { email = "user@example.com", password = "" });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("Email and password are required");
    }

    [Fact]
    public async Task Login_WithInvalidPassword_Returns401()
    {
        var client = _factory.CreateClient();
        var email = $"login{Guid.NewGuid()}@example.com";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password = "Password123" });

        var response = await client.PostAsJsonAsync("/api/auth/login", new { email, password = "WrongPassword" });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("Invalid credentials");
    }

    [Fact]
    public async Task Login_WithNonExistentEmail_Returns401()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new { email = "nonexistent@example.com", password = "Password123" });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("Invalid credentials");
    }
}
