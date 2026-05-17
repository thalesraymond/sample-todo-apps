using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<string, Todo> _todos = new();
    private readonly ConcurrentDictionary<string, string> _knownUserIdForTodo = new();
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _todosByUserId = new();

    public void AddTodo(Todo todo)
    {
        if (_knownUserIdForTodo.TryGetValue(todo.Id, out var oldUserId))
        {
            if (oldUserId != todo.UserId)
            {
                if (_todosByUserId.TryGetValue(oldUserId, out var oldUserTodos))
                {
                    oldUserTodos.TryRemove(todo.Id, out _);
                }
            }
        }

        _todos[todo.Id] = todo;
        _knownUserIdForTodo[todo.Id] = todo.UserId;

        var userTodos = _todosByUserId.GetOrAdd(todo.UserId, _ => new ConcurrentDictionary<string, byte>());
        userTodos.TryAdd(todo.Id, 0);
    }

    public void DeleteTodo(string id)
    {
        if (_todos.TryRemove(id, out _))
        {
            if (_knownUserIdForTodo.TryRemove(id, out var userId))
            {
                if (_todosByUserId.TryGetValue(userId, out var userTodos))
                {
                    userTodos.TryRemove(id, out _);
                }
            }
        }
    }

    public Todo? GetTodoById(string id)
    {
        _todos.TryGetValue(id, out var todo);
        return todo;
    }

    public List<Todo> GetTodosByUserId(string userId)
    {
        if (_todosByUserId.TryGetValue(userId, out var userTodos))
        {
            var result = new List<Todo>();
            foreach (var todoId in userTodos.Keys)
            {
                if (_todos.TryGetValue(todoId, out var todo))
                {
                    result.Add(todo);
                }
            }
            return result;
        }
        return new List<Todo>();
    }

    public void UpdateTodo(Todo todo)
    {
        if (_knownUserIdForTodo.TryGetValue(todo.Id, out var oldUserId))
        {
            if (oldUserId != todo.UserId)
            {
                if (_todosByUserId.TryGetValue(oldUserId, out var oldUserTodos))
                {
                    oldUserTodos.TryRemove(todo.Id, out _);
                }
            }
        }

        _todos[todo.Id] = todo;
        _knownUserIdForTodo[todo.Id] = todo.UserId;

        var userTodos = _todosByUserId.GetOrAdd(todo.UserId, _ => new ConcurrentDictionary<string, byte>());
        userTodos.TryAdd(todo.Id, 0);
    }
}
