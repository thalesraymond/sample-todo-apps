import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateTodoUseCase } from '../../../src/use-cases/create-todo.js'
import type { TodoRepository } from '../../../src/domain/todo-repository.js'

describe('CreateTodoUseCase', () => {
  let repository: TodoRepository
  let useCase: CreateTodoUseCase

  beforeEach(() => {
    repository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    }
    useCase = new CreateTodoUseCase(repository)
  })

  it('should create a todo and save it to the repository', async () => {
    const title = 'Buy milk'
    const result = await useCase.execute({ title }, 'user-123')

    expect(result.title).toBe(title)
    expect(repository.save).toHaveBeenCalled()
  })

  it('should throw error if title is invalid', async () => {
    await expect(useCase.execute({ title: '' }, 'user-123')).rejects.toThrow()
  })
})
