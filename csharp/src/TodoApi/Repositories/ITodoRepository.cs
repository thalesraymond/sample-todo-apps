using System.Collections.Generic;
using TodoApi.Models;

namespace TodoApi.Repositories;

public interface ITodoRepository
{
    List<Todo> GetTodosByUserId(string userId);
    Todo? GetTodoById(string id);
    void AddTodo(Todo todo);
    void UpdateTodo(Todo todo);
    void DeleteTodo(string id);
}
