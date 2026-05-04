import { api } from './api';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoDto {
  title: string;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}

class TodoService {
  public async getTodos(): Promise<Todo[]> {
    return api.get<Todo[]>('/todos');
  }

  public async createTodo(data: CreateTodoDto): Promise<Todo> {
    return api.post<Todo>('/todos', data);
  }

  public async updateTodo(id: string, data: UpdateTodoDto): Promise<Todo> {
    return api.put<Todo>(`/todos/${id}`, data);
  }

  public async deleteTodo(id: string): Promise<void> {
    return api.delete<void>(`/todos/${id}`);
  }
}

export const todoService = new TodoService();
