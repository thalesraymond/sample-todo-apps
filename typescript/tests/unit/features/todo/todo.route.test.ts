import { describe, it, expect, vi } from 'vitest'
import Fastify from 'fastify'
import { todoRoutes } from '../../../../src/features/todo/todo.route.js'
import type { TodoRepository } from '../../../../src/domain/todo-repository.js'
import { TodoController } from '../../../../src/features/todo/todo.controller.js'

vi.mock('../../../../src/features/todo/todo.controller.js')

describe('todoRoutes', () => {
  it('should register all todo routes', async () => {
    const app = Fastify({ logger: false })
    const mockRepo = {} as TodoRepository

    const getSpy = vi.spyOn(app, 'get')
    const postSpy = vi.spyOn(app, 'post')
    const putSpy = vi.spyOn(app, 'put')
    const deleteSpy = vi.spyOn(app, 'delete')

    await app.register(todoRoutes, { repository: mockRepo })

    expect(postSpy).toHaveBeenCalledWith('/', expect.any(Function))
    expect(getSpy).toHaveBeenCalledWith('/', expect.any(Function))
    expect(getSpy).toHaveBeenCalledWith('/:id', expect.any(Function))
    expect(putSpy).toHaveBeenCalledWith('/:id', expect.any(Function))
    expect(deleteSpy).toHaveBeenCalledWith('/:id', expect.any(Function))

    expect(TodoController).toHaveBeenCalledWith(mockRepo)
  })
})
