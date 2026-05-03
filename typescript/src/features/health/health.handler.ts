import type { FastifyReply, FastifyRequest } from 'fastify'

interface HealthResponse {
  status: string
  database: string
}

export async function healthHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  let databaseStatus = 'ok'
  try {
    await request.server.db.command({ ping: 1 })
  } catch (error) {
    databaseStatus = 'error'
    request.log.error(error, 'Database health check failed')
  }

  const response: HealthResponse = {
    status: databaseStatus === 'ok' ? 'ok' : 'error',
    database: databaseStatus,
  }

  const statusCode = response.status === 'ok' ? 200 : 503
  await reply.status(statusCode).send(response)
}
