import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildTestServer } from '../helpers/test-server.js'

describe('Todo Integration Tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildTestServer()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a todo', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'Integration test todo' },
    })

    expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body.title).toBe('Integration test todo')
    expect(body.id).toBeDefined()
  })

  it('should get all todos', async () => {
    // Already created one in previous test
    const response = await app.inject({
      method: 'GET',
      url: '/todos',
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
  })

  it('should get a todo by id', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'Find me' },
    })
    const { id } = createResponse.json()

    const response = await app.inject({
      method: 'GET',
      url: `/todos/${id}`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().title).toBe('Find me')
  })

  it('should update a todo', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'Update me' },
    })
    const { id } = createResponse.json()

    const response = await app.inject({
      method: 'PUT',
      url: `/todos/${id}`,
      payload: { title: 'Updated title', completed: true },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.title).toBe('Updated title')
    expect(body.completed).toBe(true)
  })

  it('should delete a todo', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'Delete me' },
    })
    const { id } = createResponse.json()

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/todos/${id}`,
    })

    expect(deleteResponse.statusCode).toBe(204)

    const getResponse = await app.inject({
      method: 'GET',
      url: `/todos/${id}`,
    })
    expect(getResponse.statusCode).toBe(404)
  })

  it('should return 404 when updating non-existent todo', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/todos/550e8400-e29b-41d4-a716-446655440000',
      payload: { title: 'New' },
    })
    expect(response.statusCode).toBe(404)
  })

  it('should return 400 when deleting with invalid id', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/todos/invalid-id',
    })
    expect(response.statusCode).toBe(400)
  })

  it('should return 404 for non-existent todo', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/todos/550e8400-e29b-41d4-a716-446655440000',
    })
    expect(response.statusCode).toBe(404)
  })
})
