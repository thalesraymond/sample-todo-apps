import { describe, it, expect, vi, beforeEach } from 'vitest';
import { todoService } from './todo.service';
import { api } from './api';

// Mock the api module
vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('todoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should call api.get with the correct endpoint', async () => {
      const mockTodos = [{ id: '1', title: 'Test Todo', completed: false, createdAt: '2023-01-01' }];
      vi.mocked(api.get).mockResolvedValue(mockTodos);

      const result = await todoService.getTodos();

      expect(api.get).toHaveBeenCalledWith('/todos');
      expect(result).toEqual(mockTodos);
    });

    it('should propagate errors from api.get', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('API Error'));
      await expect(todoService.getTodos()).rejects.toThrowError('API Error');
    });
  });

  describe('createTodo', () => {
    it('should call api.post with the correct endpoint and data', async () => {
      const mockTodo = { id: '1', title: 'New Todo', completed: false, createdAt: '2023-01-01' };
      const createData = { title: 'New Todo' };
      vi.mocked(api.post).mockResolvedValue(mockTodo);

      const result = await todoService.createTodo(createData);

      expect(api.post).toHaveBeenCalledWith('/todos', createData);
      expect(result).toEqual(mockTodo);
    });

    it('should propagate errors from api.post', async () => {
      const createData = { title: 'New Todo' };
      vi.mocked(api.post).mockRejectedValue(new Error('API Error'));
      await expect(todoService.createTodo(createData)).rejects.toThrowError('API Error');
    });
  });

  describe('updateTodo', () => {
    it('should call api.put with the correct endpoint and data', async () => {
      const mockTodo = { id: '1', title: 'Updated Todo', completed: true, createdAt: '2023-01-01' };
      const updateData = { title: 'Updated Todo', completed: true };
      vi.mocked(api.put).mockResolvedValue(mockTodo);

      const result = await todoService.updateTodo('1', updateData);

      expect(api.put).toHaveBeenCalledWith('/todos/1', updateData);
      expect(result).toEqual(mockTodo);
    });

    it('should propagate errors from api.put', async () => {
      const updateData = { title: 'Updated Todo', completed: true };
      vi.mocked(api.put).mockRejectedValue(new Error('API Error'));
      await expect(todoService.updateTodo('1', updateData)).rejects.toThrowError('API Error');
    });
  });

  describe('deleteTodo', () => {
    it('should call api.delete with the correct endpoint', async () => {
      vi.mocked(api.delete).mockResolvedValue(undefined);

      await todoService.deleteTodo('1');

      expect(api.delete).toHaveBeenCalledWith('/todos/1');
    });

    it('should propagate errors from api.delete', async () => {
      vi.mocked(api.delete).mockRejectedValue(new Error('API Error'));
      await expect(todoService.deleteTodo('1')).rejects.toThrowError('API Error');
    });
  });
});
