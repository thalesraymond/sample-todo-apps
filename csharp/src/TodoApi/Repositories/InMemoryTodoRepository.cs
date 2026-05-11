using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<string, Todo> _todos = new();

    public void AddTodo(Todo todo)
    {
        _todos[todo.Id] = todo;
    }

    public void DeleteTodo(string id)
    {
        _todos.TryRemove(id, out _);
    }

    public Todo? GetTodoById(string id)
    {
        _todos.TryGetValue(id, out var todo);
        return todo;
    }

    public List<Todo> GetTodosByUserId(string userId)
    {
        return _todos.Values.Where(t => t.UserId == userId).ToList();
    }

    public void UpdateTodo(Todo todo)
    {
        _todos[todo.Id] = todo;
    }
}
