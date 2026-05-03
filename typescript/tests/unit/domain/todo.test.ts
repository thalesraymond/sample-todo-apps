import { describe, it, expect } from 'vitest'
import { Todo } from '../../../src/domain/todo.js'
import { TodoTitle } from '../../../src/domain/todo-title.js'

describe('Todo', () => {
  it('should create a new Todo', () => {
    const title = TodoTitle.fromString('Buy milk')
    const todo = Todo.create(title)

    const data = todo.toJSON()
    expect(data.id).toBeDefined()
    expect(data.title).toBe('Buy milk')
    expect(data.completed).toBe(false)
    expect(data.createdAt).toBeInstanceOf(Date)
    expect(data.updatedAt).toBeInstanceOf(Date)
  })

  it('should mark as completed', () => {
    const title = TodoTitle.fromString('Buy milk')
    const todo = Todo.create(title)

    todo.complete()
    expect(todo.toJSON().completed).toBe(true)
  })

  it('should update title', () => {
    const title = TodoTitle.fromString('Buy milk')
    const todo = Todo.create(title)

    const newTitle = TodoTitle.fromString('Buy bread')
    todo.updateTitle(newTitle)
    expect(todo.toJSON().title).toBe('Buy bread')
  })
})
