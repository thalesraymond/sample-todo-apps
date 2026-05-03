export class HttpError extends Error {
  public readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = 'HttpError'
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message)
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message)
    this.name = 'UnauthorizedError'
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, message)
    this.name = 'ConflictError'
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string) {
    super(500, message)
    this.name = 'InternalServerError'
  }
}
