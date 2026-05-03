import type { FastifyInstance, FastifyPluginAsync } from 'fastify'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { ConflictError, BadRequestError } from '../../shared/errors/http-error.js'
import { InMemoryUserRepository } from '../../shared/repositories/in-memory-user.repository.js'

// Instantiate repository locally for now (in a real app this would be injected)
export const userRepository = new InMemoryUserRepository()

const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
      },
    },
  },
} as const

export const registerRoute: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post(
    '/api/register',
    {
      schema: registerSchema,
      config: { public: true },
    },
    async (request, reply) => {
      const { email, password } = request.body as Record<string, unknown>

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new BadRequestError('Invalid email')
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        throw new BadRequestError('Password must be at least 6 characters')
      }

      const existingUser = await userRepository.findByEmail(email)
      if (existingUser) {
        throw new ConflictError('User already exists')
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const newUser = {
        id: crypto.randomUUID(),
        email,
        passwordHash,
      }

      await userRepository.save(newUser)

      reply.status(201).send({
        id: newUser.id,
        email: newUser.email,
      })
    },
  )
}
