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
    private string? _token;

    public TodoEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    private async Task<System.Net.Http.HttpClient> GetAuthenticatedClient()
    {
        var client = _factory.CreateClient();
        if (_token == null)
        {
            var email = $"todo_user_{Guid.NewGuid()}@example.com";
            await client.PostAsJsonAsync("/api/auth/register", new { email = email, password = "Password123" });
            var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new { email = email, password = "Password123" });
            var content = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();
            _token = content.GetProperty("token").GetString();
        }

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
        return client;
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
}
