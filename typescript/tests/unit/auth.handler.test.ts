import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { authHandler } from '../../src/features/auth/auth.handler.js'
import { userRepository } from '../../src/shared/database.js'
import bcrypt from 'bcryptjs'
import { BadRequestError, UnauthorizedError } from '../../src/shared/errors/http-error.js'
import type { User } from '../../src/shared/types/index.js'

vi.mock('../../src/shared/database.js', () => ({
  userRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

describe('authHandler', () => {
  let mockRequest: Partial<FastifyRequest>
  let mockReply: unknown

  beforeEach(() => {
    vi.clearAllMocks()
    mockRequest = {
      body: {},
    }
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      server: {
        jwt: {
          sign: vi.fn().mockReturnValue('mock-token'),
        },
      },
    }
  })

  describe('register', () => {
    it('should throw BadRequestError if email or password missing', async () => {
      mockRequest.body = { email: 'test@example.com' }
      await expect(
        authHandler.register(mockRequest as any, mockReply as any),
      ).rejects.toThrow(BadRequestError)

      mockRequest.body = { password: 'password123' }
      await expect(
        authHandler.register(mockRequest as any, mockReply as any),
      ).rejects.toThrow(BadRequestError)
    })

    it('should throw BadRequestError if email already registered', async () => {
      mockRequest.body = { email: 'exists@example.com', password: 'password123' }
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: '1',
        email: 'exists@example.com',
        passwordHash: 'hash',
      } as unknown as User)

      await expect(
        authHandler.register(mockRequest as any, mockReply as any),
      ).rejects.toThrow(BadRequestError)
      expect(userRepository.findByEmail).toHaveBeenCalledWith('exists@example.com')
    })

    it('should hash password and create user on success', async () => {
      mockRequest.body = { email: 'new@example.com', password: 'password123' }
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never)
      vi.mocked(userRepository.create).mockResolvedValue({
        id: 'new-id',
        email: 'new@example.com',
        passwordHash: 'hashed-password',
      } as unknown as User)

      await authHandler.register(mockRequest as any, mockReply as any)

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        passwordHash: 'hashed-password',
      })
      expect((mockReply as any).status).toHaveBeenCalledWith(201)
      expect((mockReply as any).send).toHaveBeenCalledWith({
        message: 'User registered successfully',
        userId: 'new-id',
      })
    })
  })

  describe('login', () => {
    it('should throw BadRequestError if email or password missing', async () => {
      mockRequest.body = { email: 'test@example.com' }
      await expect(
        authHandler.login(mockRequest as any, mockReply as any),
      ).rejects.toThrow(BadRequestError)
    })

    it('should throw UnauthorizedError if user not found', async () => {
      mockRequest.body = { email: 'notfound@example.com', password: 'password123' }
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null)

      await expect(
        authHandler.login(mockRequest as any, mockReply as any),
      ).rejects.toThrow(UnauthorizedError)
    })

    it('should throw UnauthorizedError if password invalid', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'wrong' }
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hash',
      } as unknown as User)
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      await expect(
        authHandler.login(mockRequest as any, mockReply as any),
      ).rejects.toThrow(UnauthorizedError)
    })

    it('should return token on successful login', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'correct' }
      const user = { id: '1', email: 'test@example.com', passwordHash: 'hash' }
      vi.mocked(userRepository.findByEmail).mockResolvedValue(user as unknown as User)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      await authHandler.login(mockRequest as any, mockReply as any)

    expect(
        (mockReply as any).server.jwt.sign,
      ).toHaveBeenCalledWith({ sub: user.id, email: user.email })
      expect((mockReply as any).send).toHaveBeenCalledWith({ token: 'mock-token' })
    })
  })
})
