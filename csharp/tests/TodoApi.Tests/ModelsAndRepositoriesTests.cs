using FluentAssertions;
using System;
using TodoApi.Models;
using TodoApi.Repositories;
using Xunit;

namespace TodoApi.Tests;

public class ModelsAndRepositoriesTests
{
    [Fact]
    public void User_ShouldHaveExpectedProperties()
    {
        var user = new User
        {
            Id = "user-123",
            Name = "Test User",
            Email = "test@example.com",
            Password = "hashed_password"
        };

        user.Id.Should().Be("user-123");
        user.Name.Should().Be("Test User");
        user.Email.Should().Be("test@example.com");
        user.Password.Should().Be("hashed_password");
    }

    [Fact]
    public void Todo_ShouldHaveExpectedProperties()
    {
        var now = DateTime.UtcNow;
        var todo = new Todo
        {
            Id = "todo-123",
            Title = "Test Todo",
            Completed = true,
            UserId = "user-123",
            CreatedAt = now,
            UpdatedAt = now
        };

        todo.Id.Should().Be("todo-123");
        todo.Title.Should().Be("Test Todo");
        todo.Completed.Should().BeTrue();
        todo.UserId.Should().Be("user-123");
        todo.CreatedAt.Should().Be(now);
        todo.UpdatedAt.Should().Be(now);
    }

    [Fact]
    public void InMemoryUserRepository_ShouldSaveAndRetrieveUser()
    {
        var repo = new InMemoryUserRepository();
        var user = new User { Id = "u1", Email = "u1@e.com" };

        repo.AddUser(user);

        var retrievedByEmail = repo.GetUserByEmail("u1@e.com");
        retrievedByEmail.Should().NotBeNull();
        retrievedByEmail?.Id.Should().Be("u1");

        var retrievedById = repo.GetUserById("u1");
        retrievedById.Should().NotBeNull();
        retrievedById?.Email.Should().Be("u1@e.com");
    }

    [Fact]
    public void InMemoryTodoRepository_ShouldManageTodos()
    {
        var repo = new InMemoryTodoRepository();
        var todo = new Todo { Id = "t1", Title = "T1", UserId = "u1" };

        repo.AddTodo(todo);

        var allUserTodos = repo.GetTodosByUserId("u1");
        allUserTodos.Should().ContainSingle();
        allUserTodos[0].Id.Should().Be("t1");

        var retrieved = repo.GetTodoById("t1");
        retrieved.Should().NotBeNull();
        retrieved?.Title.Should().Be("T1");

        todo.Title = "Updated T1";
        repo.UpdateTodo(todo);
        repo.GetTodoById("t1")?.Title.Should().Be("Updated T1");

        repo.DeleteTodo("t1");
        repo.GetTodoById("t1").Should().BeNull();
    }
}
