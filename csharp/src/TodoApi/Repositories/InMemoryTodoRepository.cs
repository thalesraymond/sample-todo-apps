using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using TodoApi.Models;

namespace TodoApi.Repositories;

public class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<string, Todo> _todos = new();
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _userTodos = new();
    private readonly ConcurrentDictionary<string, string> _knownUserIdForTodo = new();

    public void AddTodo(Todo todo)
    {
        _todos[todo.Id] = todo;
        _knownUserIdForTodo[todo.Id] = todo.UserId;

        var userSet = _userTodos.GetOrAdd(todo.UserId, _ => new ConcurrentDictionary<string, byte>());
        userSet[todo.Id] = 1;
    }

    public void DeleteTodo(string id)
    {
        if (_todos.TryRemove(id, out _))
        {
            if (_knownUserIdForTodo.TryRemove(id, out var userId))
            {
                if (_userTodos.TryGetValue(userId, out var userSet))
                {
                    userSet.TryRemove(id, out _);
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
        if (_userTodos.TryGetValue(userId, out var userSet))
        {
            var result = new List<Todo>(userSet.Count);
            foreach (var todoId in userSet.Keys)
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
        _todos[todo.Id] = todo;

        if (_knownUserIdForTodo.TryGetValue(todo.Id, out var oldUserId))
        {
            if (oldUserId != todo.UserId)
            {
                // Remove from old user's set
                if (_userTodos.TryGetValue(oldUserId, out var oldUserSet))
                {
                    oldUserSet.TryRemove(todo.Id, out _);
                }
            }
        }

        // Add/Update to current user's set
        _knownUserIdForTodo[todo.Id] = todo.UserId;
        var userSet = _userTodos.GetOrAdd(todo.UserId, _ => new ConcurrentDictionary<string, byte>());
        userSet[todo.Id] = 1;
    }
}
