import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryTodoRepository } from '../../../src/infrastructure/in-memory-todo-repository.js'
import { Todo } from '../../../src/domain/todo.js'
import { TodoTitle } from '../../../src/domain/todo-title.js'
import { TodoId } from '../../../src/domain/todo-id.js'

describe('InMemoryTodoRepository', () => {
  let repository: InMemoryTodoRepository

  beforeEach(() => {
    repository = new InMemoryTodoRepository()
  })

  it('should save and find a todo', async () => {
    const todo = Todo.create(TodoTitle.fromString('Test todo'))
    await repository.save(todo)

    const id = TodoId.fromString(todo.toJSON().id)
    const found = await repository.findById(id)

    expect(found).toBeDefined()
    expect(found?.toJSON().id).toBe(todo.toJSON().id)
  })

  it('should return null if todo not found', async () => {
    const id = TodoId.create()
    const found = await repository.findById(id)
    expect(found).toBeNull()
  })

  it('should find all todos', async () => {
    await repository.save(Todo.create(TodoTitle.fromString('Todo 1')))
    await repository.save(Todo.create(TodoTitle.fromString('Todo 2')))

    const todos = await repository.findAll()
    expect(todos.length).toBe(2)
  })

  it('should delete a todo', async () => {
    const todo = Todo.create(TodoTitle.fromString('Delete me'))
    await repository.save(todo)

    const id = TodoId.fromString(todo.toJSON().id)
    await repository.delete(id)

    const found = await repository.findById(id)
    expect(found).toBeNull()
  })
})
