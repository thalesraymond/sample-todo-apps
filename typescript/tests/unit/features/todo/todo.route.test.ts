import { describe, it, expect, vi } from 'vitest'
import Fastify from 'fastify'
import { todoRoutes } from '../../../../src/features/todo/todo.route.js'
import type { TodoRepository } from '../../../../src/domain/todo-repository.js'
import { TodoController } from '../../../../src/features/todo/todo.controller.js'

const mockCreate = vi.fn().mockResolvedValue({})
const mockGetAll = vi.fn().mockResolvedValue([])
const mockGetById = vi.fn().mockResolvedValue({})
const mockUpdate = vi.fn().mockResolvedValue({})
const mockDelete = vi.fn().mockResolvedValue({})

vi.mock('../../../../src/features/todo/todo.controller.js', () => {
  const MockController = vi.fn().mockImplementation(function() {
    this.create = mockCreate
    this.getAll = mockGetAll
    this.getById = mockGetById
    this.update = mockUpdate
    this.delete = mockDelete
  })
  return { TodoController: MockController }
})

describe('todoRoutes', () => {
  it('should register all todo routes and route them to the correct controller methods', async () => {
    const app = Fastify({ logger: false })
    const mockRepo = {} as TodoRepository

    await app.register(todoRoutes, { repository: mockRepo })

    expect(TodoController).toHaveBeenCalledWith(mockRepo)

    await app.inject({ method: 'POST', url: '/' })
    expect(mockCreate).toHaveBeenCalled()

    await app.inject({ method: 'GET', url: '/' })
    expect(mockGetAll).toHaveBeenCalled()

    await app.inject({ method: 'GET', url: '/1' })
    expect(mockGetById).toHaveBeenCalled()

    await app.inject({ method: 'PUT', url: '/1' })
    expect(mockUpdate).toHaveBeenCalled()

    await app.inject({ method: 'DELETE', url: '/1' })
    expect(mockDelete).toHaveBeenCalled()
  })
})
