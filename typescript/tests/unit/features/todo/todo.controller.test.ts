import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TodoController } from '../../../../src/features/todo/todo.controller.js'
import type { TodoRepository } from '../../../../src/domain/todo-repository.js'
import { NotFoundError } from '../../../../src/shared/errors/http-error.js'
import type { FastifyRequest, FastifyReply } from 'fastify'

describe('TodoController', () => {
  let repository: TodoRepository
  let controller: TodoController
  let mockReply: FastifyReply

  beforeEach(() => {
    repository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    }
    controller = new TodoController(repository)
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply
  })

  describe('getById', () => {
    it('should throw NotFoundError when use case returns null', async () => {
      // Setup the mock repository to return null for findById (simulating not found)
      vi.mocked(repository.findById).mockResolvedValue(null)

      const request = {
        params: { id: '00000000-0000-0000-0000-000000000000' },
        user: { sub: 'user-123' },
      } as unknown as FastifyRequest<{ Params: { id: string } }>

      await expect(controller.getById(request, mockReply)).rejects.toThrow(NotFoundError)
      await expect(controller.getById(request, mockReply)).rejects.toThrow('Todo not found')
    })
  })
})
