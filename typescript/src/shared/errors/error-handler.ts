import type { FastifyInstance } from 'fastify'
import type { FastifyError } from 'fastify'
import { HttpError } from './http-error.js'

interface ErrorResponse {
  statusCode: number
  error: string
  message: string
}

function isValidationError(error: FastifyError): boolean {
  return error && error.validation !== undefined
}

function buildValidationResponse(error: FastifyError): ErrorResponse {
  return {
    statusCode: 400,
    error: 'Bad Request',
    message: error.message,
  }
}

function buildHttpErrorResponse(error: HttpError): ErrorResponse {
  return {
    statusCode: error.statusCode,
    error: error.name,
    message: error.message,
  }
}

function buildInternalErrorResponse(): ErrorResponse {
  return {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  }
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, _request, reply) => {
    if (isValidationError(error as FastifyError)) {
      const response = buildValidationResponse(error as FastifyError)
      return reply.status(response.statusCode).send(response)
    }

    if (error instanceof HttpError) {
      const response = buildHttpErrorResponse(error)
      return reply.status(response.statusCode).send(response)
    }

    app.log.error(error)
    const response = buildInternalErrorResponse()
    return reply.status(response.statusCode).send(response)
  })
}
