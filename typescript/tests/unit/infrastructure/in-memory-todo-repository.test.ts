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

  it('should return an empty array when finding all todos and repository is empty', async () => {
    const todos = await repository.findAll()
    expect(todos.length).toBe(0)
  })

  it('should overwrite an existing todo with the same id when saving', async () => {
    const todo1 = Todo.create(TodoTitle.fromString('Original Todo'))
    await repository.save(todo1)

    // Complete the todo to change its state but keep the same ID
    todo1.complete()
    await repository.save(todo1)

    const todos = await repository.findAll()
    expect(todos.length).toBe(1)

    // We parse the toJSON value because the ID on the class instance is private.
    const id = TodoId.fromString(todo1.toJSON().id)
    const found = await repository.findById(id)
    expect(found?.toJSON().completed).toBe(true)
  })

  it('should delete a todo', async () => {
    const todo = Todo.create(TodoTitle.fromString('Delete me'))
    await repository.save(todo)

    const id = TodoId.fromString(todo.toJSON().id)
    await repository.delete(id)

    const found = await repository.findById(id)
    expect(found).toBeNull()
  })

  it('should handle deleting a non-existent todo gracefully', async () => {
    const id = TodoId.create()

    // Deleting a non-existent ID should not throw an error
    await expect(repository.delete(id)).resolves.toBeUndefined()
  })
})
