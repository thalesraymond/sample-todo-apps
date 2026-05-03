import type { FastifyInstance, FastifyPluginAsync } from 'fastify'
import bcrypt from 'bcrypt'
import { UnauthorizedError, BadRequestError } from '../../shared/errors/http-error.js'
import { userRepository } from './register.route.js'

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  },
} as const

export const loginRoute: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post(
    '/api/login',
    {
      schema: loginSchema,
      config: { public: true },
    },
    async (request, reply) => {
      const { email, password } = request.body as Record<string, unknown>

      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        throw new BadRequestError('Email and password are required')
      }

      const user = await userRepository.findByEmail(email)
      if (!user) {
        throw new UnauthorizedError('Invalid credentials')
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid credentials')
      }

      const token = app.jwt.sign({ id: user.id, email: user.email })

      reply.status(200).send({
        token,
      })
    },
  )
}
