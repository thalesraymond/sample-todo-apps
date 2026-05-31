import { describe, it, expect } from 'vitest'
import {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '../../../../src/shared/errors/http-error.js'

describe('HttpError and subclasses', () => {
  describe('HttpError', () => {
    it('should correctly set message, statusCode, and name', () => {
      const error = new HttpError(418, 'I am a teapot')
      expect(error.message).toBe('I am a teapot')
      expect(error.statusCode).toBe(418)
      expect(error.name).toBe('HttpError')
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('BadRequestError', () => {
    it('should correctly set message, statusCode (400), and name', () => {
      const error = new BadRequestError('Bad input')
      expect(error.message).toBe('Bad input')
      expect(error.statusCode).toBe(400)
      expect(error.name).toBe('BadRequestError')
      expect(error).toBeInstanceOf(HttpError)
    })
  })

  describe('UnauthorizedError', () => {
    it('should correctly set message, statusCode (401), and name', () => {
      const error = new UnauthorizedError('Not logged in')
      expect(error.message).toBe('Not logged in')
      expect(error.statusCode).toBe(401)
      expect(error.name).toBe('UnauthorizedError')
      expect(error).toBeInstanceOf(HttpError)
    })
  })

  describe('NotFoundError', () => {
    it('should correctly set message, statusCode (404), and name', () => {
      const error = new NotFoundError('Item not found')
      expect(error.message).toBe('Item not found')
      expect(error.statusCode).toBe(404)
      expect(error.name).toBe('NotFoundError')
      expect(error).toBeInstanceOf(HttpError)
    })
  })

  describe('ConflictError', () => {
    it('should correctly set message, statusCode (409), and name', () => {
      const error = new ConflictError('Item already exists')
      expect(error.message).toBe('Item already exists')
      expect(error.statusCode).toBe(409)
      expect(error.name).toBe('ConflictError')
      expect(error).toBeInstanceOf(HttpError)
    })
  })

  describe('InternalServerError', () => {
    it('should correctly set message, statusCode (500), and name', () => {
      const error = new InternalServerError('Database down')
      expect(error.message).toBe('Database down')
      expect(error.statusCode).toBe(500)
      expect(error.name).toBe('InternalServerError')
      expect(error).toBeInstanceOf(HttpError)
    })
  })
})
