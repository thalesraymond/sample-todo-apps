import type { FastifyInstance } from 'fastify'
import { authHandler } from './auth.handler.js'

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  app.post('/register', { config: { public: true } }, authHandler.register)
  app.post('/login', { config: { public: true } }, authHandler.login)
}
