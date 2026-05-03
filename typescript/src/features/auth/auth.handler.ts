import type { FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import { userRepository } from '../../shared/database.js'
import { BadRequestError, UnauthorizedError } from '../../shared/errors/http-error.js'

export const authHandler = {
  async register(
    request: FastifyRequest<{ Body: { email?: string; password?: string } }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body

    if (!email || !password) {
      throw new BadRequestError('Email and password are required')
    }

    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      throw new BadRequestError('Email already registered')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await userRepository.create({ email, passwordHash })

    return reply.status(201).send({
      message: 'User registered successfully',
      userId: user.id,
    })
  },

  async login(
    request: FastifyRequest<{ Body: { email?: string; password?: string } }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body

    if (!email || !password) {
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

    const token = reply.server.jwt.sign({ sub: user.id, email: user.email })

    return reply.send({ token })
  },
}
