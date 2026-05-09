import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateTodoUseCase } from '../../../src/use-cases/update-todo.js'
import type { TodoRepository } from '../../../src/domain/todo-repository.js'
import { Todo } from '../../../src/domain/todo.js'
import { TodoTitle } from '../../../src/domain/todo-title.js'

describe('UpdateTodoUseCase', () => {
  let repository: TodoRepository
  let useCase: UpdateTodoUseCase

  beforeEach(() => {
    repository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    }
    useCase = new UpdateTodoUseCase(repository)
  })

  it('should update a todo', async () => {
    const todo = Todo.create(TodoTitle.fromString('Old title'), 'user-123')
    vi.mocked(repository.findById).mockResolvedValue(todo)

    const result = await useCase.execute(todo.toJSON().id, {
      title: 'New title',
      completed: true,
    }, 'user-123')

    expect(result?.title).toBe('New title')
    expect(result?.completed).toBe(true)
    expect(repository.save).toHaveBeenCalled()
  })

  it('should update only title', async () => {
    const todo = Todo.create(TodoTitle.fromString('Old title'), 'user-123')
    vi.mocked(repository.findById).mockResolvedValue(todo)

    const result = await useCase.execute(todo.toJSON().id, {
      title: 'New title',
    }, 'user-123')

    expect(result?.title).toBe('New title')
    expect(result?.completed).toBe(false)
  })

  it('should update only completed status', async () => {
    const todo = Todo.create(TodoTitle.fromString('Same title'), 'user-123')
    vi.mocked(repository.findById).mockResolvedValue(todo)

    const result = await useCase.execute(todo.toJSON().id, {
      completed: true,
    }, 'user-123')

    expect(result?.title).toBe('Same title')
    expect(result?.completed).toBe(true)
  })

  it('should return null if id is invalid', async () => {
    const result = await useCase.execute('invalid-uuid', { title: 'New' }, 'user-123')
    expect(result).toBeNull()
  })

  it('should return null if todo not found', async () => {
    vi.mocked(repository.findById).mockResolvedValue(null)
    const result = await useCase.execute('non-existent', { title: 'New' }, 'user-123')
    expect(result).toBeNull()
  })
})
