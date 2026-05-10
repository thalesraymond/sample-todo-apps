import { describe, it, expect, vi } from 'vitest'
import { TodoController } from '../../src/features/todo/todo.controller.js'
import type { TodoRepository } from '../../src/domain/todo-repository.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { BadRequestError } from '../../src/shared/errors/http-error.js'

describe('TodoController', () => {
  it('should throw BadRequestError if delete fails with an error message containing "id"', async () => {
    // The controller internally creates DeleteTodoUseCase which calls repository.delete
    const mockRepository: TodoRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn().mockRejectedValue(new Error('Invalid id format')),
    }

    const controller = new TodoController(mockRepository)

    const request = {
      params: { id: 'invalid-id' },
    } as unknown as FastifyRequest<{ Params: { id: string } }>

    const reply = {} as FastifyReply

    await expect(controller.delete(request, reply)).rejects.toThrow(BadRequestError)
  })

  it('should throw original error if delete fails with non-id error', async () => {
    const mockRepository: TodoRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn().mockRejectedValue(new Error('Database connection failed')),
    }

    const controller = new TodoController(mockRepository)

    const request = {
      params: { id: '550e8400-e29b-41d4-a716-446655440000' },
    } as unknown as FastifyRequest<{ Params: { id: string } }>

    const reply = {} as FastifyReply

    await expect(controller.delete(request, reply)).rejects.toThrow('Database connection failed')
  })
})
