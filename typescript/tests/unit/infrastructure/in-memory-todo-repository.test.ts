import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryTodoRepository } from '../../../src/infrastructure/in-memory-todo-repository.js'
import { Todo } from '../../../src/domain/todo.js'
import { TodoTitle } from '../../../src/domain/todo-title.js'
import { TodoId } from '../../../src/domain/todo-id.js'

describe('InMemoryTodoRepository', () => {
  let repository: InMemoryTodoRepository
  const userId = 'user-123'
  const otherUserId = 'user-456'

  beforeEach(() => {
    repository = new InMemoryTodoRepository()
  })

  it('should save and find a todo', async () => {
    const todo = Todo.create(TodoTitle.fromString('Test todo'), userId)
    await repository.save(todo)

    const id = TodoId.fromString(todo.toJSON().id)
    const found = await repository.findById(id, userId)

    expect(found).toBeDefined()
    expect(found?.toJSON().id).toBe(todo.toJSON().id)
  })

  it('should return null if todo not found', async () => {
    const id = TodoId.create()
    const found = await repository.findById(id, userId)
    expect(found).toBeNull()
  })

  it('should return null if todo belongs to another user', async () => {
    const todo = Todo.create(TodoTitle.fromString('Test todo'), userId)
    await repository.save(todo)

    const id = TodoId.fromString(todo.toJSON().id)
    const found = await repository.findById(id, otherUserId)
    expect(found).toBeNull()
  })

  it('should find all todos for the specific user', async () => {
    await repository.save(Todo.create(TodoTitle.fromString('Todo 1'), userId))
    await repository.save(Todo.create(TodoTitle.fromString('Todo 2'), otherUserId))

    const todos = await repository.findAll(userId)
    expect(todos.length).toBe(1)
    expect(todos[0].toJSON().title).toBe('Todo 1')
  })

  it('should delete a todo', async () => {
    const todo = Todo.create(TodoTitle.fromString('Delete me'), userId)
    await repository.save(todo)

    const id = TodoId.fromString(todo.toJSON().id)
    await repository.delete(id, userId)

    const found = await repository.findById(id, userId)
    expect(found).toBeNull()
  })
})
