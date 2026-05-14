import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetTodosUseCase, GetTodoByIdUseCase } from '../../../src/use-cases/get-todos.js'
import type { TodoRepository } from '../../../src/domain/todo-repository.js'
import { Todo } from '../../../src/domain/todo.js'
import { TodoTitle } from '../../../src/domain/todo-title.js'

describe('GetTodos Use Cases', () => {
  let repository: TodoRepository

  beforeEach(() => {
    repository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    }
  })

  describe('GetTodosUseCase', () => {
    it('should return all todos', async () => {
      const todo = Todo.create(TodoTitle.fromString('Test'), 'user-123')
      vi.mocked(repository.findAll).mockResolvedValue([todo])

      const useCase = new GetTodosUseCase(repository)
      const result = await useCase.execute('user-123')

      expect(result.length).toBe(1)
      expect(result[0]?.title).toBe('Test')
    })
  })

  describe('GetTodoByIdUseCase', () => {
    it('should return a todo by id', async () => {
      const todo = Todo.create(TodoTitle.fromString('Test'), 'user-123')
      vi.mocked(repository.findById).mockResolvedValue(todo)

      const useCase = new GetTodoByIdUseCase(repository)
      const result = await useCase.execute(todo.toJSON().id, 'user-123')

      expect(result?.title).toBe('Test')
    })

    it('should return null if todo not found', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null)
      const useCase = new GetTodoByIdUseCase(repository)
      const validUuid = '00000000-0000-0000-0000-000000000000'
      const result = await useCase.execute(validUuid, 'user-123')
      expect(result).toBeNull()
    })

    it('should return null if id is in invalid format', async () => {
      vi.mocked(repository.findById).mockRejectedValue(new Error('invalid id'))
      const useCase = new GetTodoByIdUseCase(repository)
      const result = await useCase.execute('invalid-id', 'user-123')
      expect(result).toBeNull()
    })

    it('should throw if repository throws an unknown error', async () => {
      const todo = Todo.create(TodoTitle.fromString('Test'), 'user-123')
      vi.mocked(repository.findById).mockRejectedValue(new Error('Database error'))

      const useCase = new GetTodoByIdUseCase(repository)
      await expect(useCase.execute(todo.toJSON().id, 'user-123')).rejects.toThrow('Database error')
    })

    it('should return null if repository throws an error with "id" in the message', async () => {
      vi.mocked(repository.findById).mockRejectedValue(new Error('Invalid ID provided'))

      const useCase = new GetTodoByIdUseCase(repository)
      const validUuid = '00000000-0000-0000-0000-000000000000'
      const result = await useCase.execute(validUuid, 'user-123')

      expect(result).toBeNull()
    })

    it('should throw if repository throws a non-Error object', async () => {
      const todo = Todo.create(TodoTitle.fromString('Test'), 'user-123')
      // Simulate throwing a string instead of an Error object
      vi.mocked(repository.findById).mockRejectedValue('Database error id')

      const useCase = new GetTodoByIdUseCase(repository)
      // Since it's a string, it fails the `error instanceof Error` check and is re-thrown
      await expect(useCase.execute(todo.toJSON().id, 'user-123')).rejects.toThrow(
        'Database error id',
      )
    })
  })
})
