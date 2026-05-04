import React, { useEffect, useState } from 'react';
import { todoService } from '../../services/todo.service';
import type { Todo } from '../../services/todo.service';
import { TodoItem } from '../../features/todos/TodoItem';
import { TodoForm } from '../../features/todos/TodoForm';
import { Card } from '../../components/ui/Card';
import './Dashboard.css';

export const DashboardView: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const data = await todoService.getTodos();
      setTodos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await todoService.createTodo({ title });
      setTodos((prev) => [...prev, newTodo]);
    } catch (err: any) {
      setError(err.message || 'Failed to add todo');
      throw err;
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, { completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo');
    }
  };

  return (
    <div className="dashboard-container">
      <Card title="Your Tasks" className="dashboard-card">
        <TodoForm onSubmit={handleAddTodo} />
        
        {error && <div className="error-alert">{error}</div>}
        
        <div className="todo-list">
          {isLoading ? (
            <div className="loading-state">Loading tasks...</div>
          ) : todos.length === 0 ? (
            <div className="empty-state">No tasks yet. Add one above!</div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
