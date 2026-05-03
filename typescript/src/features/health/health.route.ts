import type { FastifyInstance } from 'fastify'
import { healthHandler } from './health.handler.js'
import '../../shared/types/index.js'

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/health',
    {
      config: { public: true },
      schema: {
        description: 'Check application health status',
        tags: ['System'],
        response: {
          200: {
            description: 'Successful health check',
            type: 'object',
            properties: {
              status: { type: 'string', example: 'ok' },
              database: { type: 'string', example: 'ok' },
            },
          },
        },
      },
    },
    healthHandler,
  )
}
