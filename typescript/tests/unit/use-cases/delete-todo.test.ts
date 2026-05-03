import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteTodoUseCase } from '../../../src/use-cases/delete-todo.js'
import type { TodoRepository } from '../../../src/domain/todo-repository.js'
import { TodoId } from '../../../src/domain/todo-id.js'

describe('DeleteTodoUseCase', () => {
  let repository: TodoRepository
  let useCase: DeleteTodoUseCase

  beforeEach(() => {
    repository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    }
    useCase = new DeleteTodoUseCase(repository)
  })

  it('should delete a todo', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000'
    await useCase.execute(id)
    expect(repository.delete).toHaveBeenCalledWith(expect.any(TodoId))
  })

  it('should throw error for invalid id', async () => {
    await expect(useCase.execute('invalid')).rejects.toThrow()
  })
})
