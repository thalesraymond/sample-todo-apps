using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using TodoApi.Models;
using Xunit;

namespace TodoApi.Tests;

public class TodoEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public TodoEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    private async Task<System.Net.Http.HttpClient> GetAuthenticatedClient()
    {
        var client = _factory.CreateClient();
        var email = $"todo_user_{Guid.NewGuid()}@example.com";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password = "Password123" });
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new { email, password = "Password123" });
        var content = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();
        var token = content.GetProperty("token").GetString();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    [Fact]
    public async Task GetTodos_WithoutAuth_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/todos");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateTodo_WithoutAuth_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/todos", new { title = "Test" });
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetTodoById_WithoutAuth_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/todos/some-id");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task UpdateTodo_WithoutAuth_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.PutAsJsonAsync("/todos/some-id", new { title = "Updated" });
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task DeleteTodo_WithoutAuth_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.DeleteAsync("/todos/some-id");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetTodos_ReturnsEmptyListInitially()
    {
        var client = await GetAuthenticatedClient();
        var response = await client.GetAsync("/todos");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var todos = await response.Content.ReadFromJsonAsync<List<Todo>>();
        todos.Should().BeEmpty();
    }

    [Fact]
    public async Task CreateTodo_ReturnsCreatedTodo()
    {
        var client = await GetAuthenticatedClient();
        var response = await client.PostAsJsonAsync("/todos", new { title = "Test Todo" });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var todo = await response.Content.ReadFromJsonAsync<Todo>();
        todo.Should().NotBeNull();
        todo!.Id.Should().NotBeNullOrEmpty();
        todo.Title.Should().Be("Test Todo");
        todo.Completed.Should().BeFalse();
        todo.UserId.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task CreateTodo_WithEmptyTitle_Returns400()
    {
        var client = await GetAuthenticatedClient();
        var response = await client.PostAsJsonAsync("/todos", new { title = "" });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("Title is required");
    }

    [Fact]
    public async Task CreateTodo_WithWhitespaceTitle_Returns400()
    {
        var client = await GetAuthenticatedClient();
        var response = await client.PostAsJsonAsync("/todos", new { title = "   " });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        content.GetProperty("message").GetString().Should().Be("Title is required");
    }

    [Fact]
    public async Task GetTodoById_ReturnsTodo()
    {
        var client = await GetAuthenticatedClient();
        var createResponse = await client.PostAsJsonAsync("/todos", new { title = "To Get" });
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<Todo>();

        var response = await client.GetAsync($"/todos/{createdTodo!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var fetchedTodo = await response.Content.ReadFromJsonAsync<Todo>();
        fetchedTodo!.Id.Should().Be(createdTodo.Id);
        fetchedTodo.Title.Should().Be("To Get");
    }

    [Fact]
    public async Task GetTodoById_NotFound_Returns404()
    {
        var client = await GetAuthenticatedClient();
        var response = await client.GetAsync("/todos/nonexistent-id");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetTodoById_BelongingToAnotherUser_Returns404()
    {
        var ownerClient = await GetAuthenticatedClient();
        var createResponse = await ownerClient.PostAsJsonAsync("/todos", new { title = "Owner's Todo" });
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<Todo>();

        var otherClient = await GetAuthenticatedClient();
        var response = await otherClient.GetAsync($"/todos/{createdTodo!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateTodo_UpdatesAndReturnsTodo()
    {
        var client = await GetAuthenticatedClient();
        var createResponse = await client.PostAsJsonAsync("/todos", new { title = "To Update" });
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<Todo>();

        var response = await client.PutAsJsonAsync($"/todos/{createdTodo!.Id}", new { title = "Updated Title", completed = true });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updatedTodo = await response.Content.ReadFromJsonAsync<Todo>();
        updatedTodo!.Title.Should().Be("Updated Title");
        updatedTodo.Completed.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateTodo_NotFound_Returns404()
    {
        var client = await GetAuthenticatedClient();
        var response = await client.PutAsJsonAsync("/todos/nonexistent-id", new { title = "Updated" });
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateTodo_BelongingToAnotherUser_Returns404()
    {
        var ownerClient = await GetAuthenticatedClient();
        var createResponse = await ownerClient.PostAsJsonAsync("/todos", new { title = "Owner's Todo" });
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<Todo>();

        var otherClient = await GetAuthenticatedClient();
        var response = await otherClient.PutAsJsonAsync($"/todos/{createdTodo!.Id}", new { title = "Hijacked" });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteTodo_RemovesTodoAndReturns204()
    {
        var client = await GetAuthenticatedClient();
        var createResponse = await client.PostAsJsonAsync("/todos", new { title = "To Delete" });
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<Todo>();

        var response = await client.DeleteAsync($"/todos/{createdTodo!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await client.GetAsync($"/todos/{createdTodo.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteTodo_NotFound_Returns404()
    {
        var client = await GetAuthenticatedClient();
        var response = await client.DeleteAsync("/todos/nonexistent-id");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteTodo_BelongingToAnotherUser_Returns404()
    {
        var ownerClient = await GetAuthenticatedClient();
        var createResponse = await ownerClient.PostAsJsonAsync("/todos", new { title = "Owner's Todo" });
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<Todo>();

        var otherClient = await GetAuthenticatedClient();
        var response = await otherClient.DeleteAsync($"/todos/{createdTodo!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetTodos_ReturnsOnlyCurrentUserTodos()
    {
        var user1Client = await GetAuthenticatedClient();
        await user1Client.PostAsJsonAsync("/todos", new { title = "User 1 Todo" });

        var user2Client = await GetAuthenticatedClient();
        await user2Client.PostAsJsonAsync("/todos", new { title = "User 2 Todo" });

        var response = await user1Client.GetAsync("/todos");
        var todos = await response.Content.ReadFromJsonAsync<List<Todo>>();

        todos.Should().HaveCount(1);
        todos![0].Title.Should().Be("User 1 Todo");
    }
}
