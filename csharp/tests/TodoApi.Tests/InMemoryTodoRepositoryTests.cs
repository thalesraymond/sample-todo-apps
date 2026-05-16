using FluentAssertions;
using System;
using TodoApi.Models;
using TodoApi.Repositories;
using Xunit;

namespace TodoApi.Tests;

public class InMemoryTodoRepositoryTests
{
    private readonly InMemoryTodoRepository _repository;

    public InMemoryTodoRepositoryTests()
    {
        _repository = new InMemoryTodoRepository();
    }

    [Fact]
    public void AddTodo_ShouldStoreTodo()
    {
        // Arrange
        var todo = new Todo { Id = "t1", Title = "Test Todo 1", UserId = "u1" };

        // Act
        _repository.AddTodo(todo);

        // Assert
        var retrieved = _repository.GetTodoById("t1");
        retrieved.Should().NotBeNull();
        retrieved.Should().BeEquivalentTo(todo);
    }

    [Fact]
    public void GetTodoById_ShouldReturnNull_WhenTodoDoesNotExist()
    {
        // Act
        var retrieved = _repository.GetTodoById("non-existent-id");

        // Assert
        retrieved.Should().BeNull();
    }

    [Fact]
    public void GetTodoById_ShouldReturnTodo_WhenTodoExists()
    {
        // Arrange
        var todo = new Todo { Id = "t2", Title = "Test Todo 2", UserId = "u2" };
        _repository.AddTodo(todo);

        // Act
        var retrieved = _repository.GetTodoById("t2");

        // Assert
        retrieved.Should().NotBeNull();
        retrieved.Should().BeEquivalentTo(todo);
    }

    [Fact]
    public void GetTodosByUserId_ShouldReturnOnlyUserTodos()
    {
        // Arrange
        var todo1 = new Todo { Id = "t1", Title = "User 1 Todo 1", UserId = "u1" };
        var todo2 = new Todo { Id = "t2", Title = "User 1 Todo 2", UserId = "u1" };
        var todo3 = new Todo { Id = "t3", Title = "User 2 Todo 1", UserId = "u2" };

        _repository.AddTodo(todo1);
        _repository.AddTodo(todo2);
        _repository.AddTodo(todo3);

        // Act
        var user1Todos = _repository.GetTodosByUserId("u1");

        // Assert
        user1Todos.Should().HaveCount(2);
        user1Todos.Should().Contain(t => t.Id == "t1");
        user1Todos.Should().Contain(t => t.Id == "t2");
        user1Todos.Should().NotContain(t => t.Id == "t3");
    }

    [Fact]
    public void GetTodosByUserId_ShouldReturnEmptyList_WhenUserHasNoTodos()
    {
        // Arrange
        var todo = new Todo { Id = "t1", Title = "User 1 Todo", UserId = "u1" };
        _repository.AddTodo(todo);

        // Act
        var user2Todos = _repository.GetTodosByUserId("u2");

        // Assert
        user2Todos.Should().BeEmpty();
    }

    [Fact]
    public void UpdateTodo_ShouldUpdateExistingTodo()
    {
        // Arrange
        var todo = new Todo { Id = "t1", Title = "Original Title", UserId = "u1", Completed = false };
        _repository.AddTodo(todo);

        var updatedTodo = new Todo { Id = "t1", Title = "Updated Title", UserId = "u1", Completed = true };

        // Act
        _repository.UpdateTodo(updatedTodo);

        // Assert
        var retrieved = _repository.GetTodoById("t1");
        retrieved.Should().NotBeNull();
        retrieved?.Title.Should().Be("Updated Title");
        retrieved?.Completed.Should().BeTrue();
    }

    [Fact]
    public void UpdateTodo_ShouldAddTodo_WhenTodoDoesNotExist()
    {
        // The current implementation of InMemoryTodoRepository uses `_todos[todo.Id] = todo;`
        // which acts as an upsert (add or update). We should test this behavior.

        // Arrange
        var newTodo = new Todo { Id = "t1", Title = "New Todo", UserId = "u1" };

        // Act
        _repository.UpdateTodo(newTodo);

        // Assert
        var retrieved = _repository.GetTodoById("t1");
        retrieved.Should().NotBeNull();
        retrieved?.Title.Should().Be("New Todo");
    }

    [Fact]
    public void DeleteTodo_ShouldRemoveTodo()
    {
        // Arrange
        var todo = new Todo { Id = "t1", Title = "Test Todo", UserId = "u1" };
        _repository.AddTodo(todo);

        // Act
        _repository.DeleteTodo("t1");

        // Assert
        var retrieved = _repository.GetTodoById("t1");
        retrieved.Should().BeNull();
    }

    [Fact]
    public void DeleteTodo_ShouldDoNothing_WhenTodoDoesNotExist()
    {
        // Arrange
        var todo = new Todo { Id = "t1", Title = "Test Todo", UserId = "u1" };
        _repository.AddTodo(todo);

        // Act
        Action act = () => _repository.DeleteTodo("non-existent-id");

        // Assert
        act.Should().NotThrow();
        // Ensure existing todo was not affected
        _repository.GetTodoById("t1").Should().NotBeNull();
    }
}
