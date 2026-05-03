import { describe, it, expect } from 'vitest'
import {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '../../src/shared/errors/http-error.js'

describe('HttpError', () => {
  it('should create an error with the given status code and message', () => {
    const error = new HttpError(418, 'I am a teapot')

    expect(error.statusCode).toBe(418)
    expect(error.message).toBe('I am a teapot')
    expect(error.name).toBe('HttpError')
  })

  it('should be an instance of Error', () => {
    const error = new HttpError(500, 'fail')

    expect(error).toBeInstanceOf(Error)
  })
})

describe('BadRequestError', () => {
  it('should have status code 400', () => {
    const error = new BadRequestError('invalid input')

    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('BadRequestError')
  })
})

describe('UnauthorizedError', () => {
  it('should have status code 401', () => {
    const error = new UnauthorizedError('not authenticated')

    expect(error.statusCode).toBe(401)
    expect(error.name).toBe('UnauthorizedError')
  })
})

describe('NotFoundError', () => {
  it('should have status code 404', () => {
    const error = new NotFoundError('resource missing')

    expect(error.statusCode).toBe(404)
    expect(error.name).toBe('NotFoundError')
  })
})

describe('ConflictError', () => {
  it('should have status code 409', () => {
    const error = new ConflictError('already exists')

    expect(error.statusCode).toBe(409)
    expect(error.name).toBe('ConflictError')
  })
})

describe('InternalServerError', () => {
  it('should have status code 500', () => {
    const error = new InternalServerError('unexpected')

    expect(error.statusCode).toBe(500)
    expect(error.name).toBe('InternalServerError')
  })
})
