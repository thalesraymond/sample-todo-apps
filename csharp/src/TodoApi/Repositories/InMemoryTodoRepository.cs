using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<string, Todo> _todos = new();
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _todosByUserId = new();

    // Tracks the known user ID for each todo to handle mutable references
    private readonly ConcurrentDictionary<string, string> _knownUserIdForTodo = new();

    public void AddTodo(Todo todo)
    {
        _todos[todo.Id] = todo;
        _knownUserIdForTodo[todo.Id] = todo.UserId;

        var userTodos = _todosByUserId.GetOrAdd(todo.UserId, _ => new ConcurrentDictionary<string, byte>());
        userTodos.TryAdd(todo.Id, 0);
    }

    public void DeleteTodo(string id)
    {
        if (_todos.TryRemove(id, out var todo))
        {
            if (_knownUserIdForTodo.TryRemove(id, out var knownUserId))
            {
                if (_todosByUserId.TryGetValue(knownUserId, out var userTodos))
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
        if (_todosByUserId.TryGetValue(userId, out var userTodoIds))
        {
            var result = new List<Todo>(userTodoIds.Count);
            foreach (var id in userTodoIds.Keys)
            {
                if (_todos.TryGetValue(id, out var todo))
                {
                    // Double check to ensure resilience against stale indexes
                    if (todo.UserId == userId)
                    {
                        result.Add(todo);
                    }
                }
            }
            return result;
        }
        return new List<Todo>();
    }

    public void UpdateTodo(Todo todo)
    {
        _todos[todo.Id] = todo;

        if (_knownUserIdForTodo.TryGetValue(todo.Id, out var oldUserId))
        {
            if (oldUserId != todo.UserId)
            {
                // Remove from old user's list
                if (_todosByUserId.TryGetValue(oldUserId, out var oldUserTodos))
                {
                    oldUserTodos.TryRemove(todo.Id, out _);
                }

                // Add to new user's list
                var newUserTodos = _todosByUserId.GetOrAdd(todo.UserId, _ => new ConcurrentDictionary<string, byte>());
                newUserTodos.TryAdd(todo.Id, 0);

                // Update known user id
                _knownUserIdForTodo[todo.Id] = todo.UserId;
            }
        }
        else
        {
            // It was not known, add it
            _knownUserIdForTodo[todo.Id] = todo.UserId;
            var newUserTodos = _todosByUserId.GetOrAdd(todo.UserId, _ => new ConcurrentDictionary<string, byte>());
            newUserTodos.TryAdd(todo.Id, 0);
        }
    }
}
