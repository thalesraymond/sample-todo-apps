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
      const todo = Todo.create(TodoTitle.fromString('Test'))
      vi.mocked(repository.findAll).mockResolvedValue([todo])

      const useCase = new GetTodosUseCase(repository)
      const result = await useCase.execute()

      expect(result.length).toBe(1)
      expect(result[0]?.title).toBe('Test')
    })
  })

  describe('GetTodoByIdUseCase', () => {
    it('should return a todo by id', async () => {
      const todo = Todo.create(TodoTitle.fromString('Test'))
      vi.mocked(repository.findById).mockResolvedValue(todo)

      const useCase = new GetTodoByIdUseCase(repository)
      const result = await useCase.execute(todo.toJSON().id)

      expect(result?.title).toBe('Test')
    })

    it('should return null if todo not found', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null)
      const useCase = new GetTodoByIdUseCase(repository)
      const result = await useCase.execute('non-existent')
      expect(result).toBeNull()
    })
  })
})
