import type { FastifyReply, FastifyRequest } from 'fastify'

interface HealthResponse {
  status: string
}

export async function healthHandler(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const response: HealthResponse = { status: 'ok' }
  await reply.status(200).send(response)
}
