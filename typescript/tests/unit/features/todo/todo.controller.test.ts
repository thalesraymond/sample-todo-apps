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
        user: { sub: 'user-id' },
        params: { id: 'non-existent-id' },
      } as unknown as FastifyRequest<{ Params: { id: string } }>

      await expect(controller.getById(request, mockReply)).rejects.toThrowError('Todo not found')
    })
  })

  describe('delete', () => {
    it('should throw BadRequestError if delete fails with an error message containing "id"', async () => {
      vi.mocked(repository.delete).mockRejectedValue(new Error('Invalid id format'))

      const request = {
        user: { sub: 'user-id' },
        params: { id: 'invalid-id' },
      } as unknown as FastifyRequest<{ Params: { id: string } }>

      await expect(controller.delete(request, mockReply)).rejects.toThrowError('Invalid ID')
    })

    it('should throw original error if delete fails with non-id error', async () => {
      vi.mocked(repository.delete).mockRejectedValue(new Error('Database connection failed'))

      const request = {
        user: { sub: 'user-id' },
        params: { id: '550e8400-e29b-41d4-a716-446655440000' },
      } as unknown as FastifyRequest<{ Params: { id: string } }>

      await expect(controller.delete(request, mockReply)).rejects.toThrowError('Database connection failed')
    })
  })
})
