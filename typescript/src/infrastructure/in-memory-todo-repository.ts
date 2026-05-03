import type { TodoRepository } from '../domain/todo-repository.js'
import type { Todo } from '../domain/todo.js'
import type { TodoId } from '../domain/todo-id.js'

export class InMemoryTodoRepository implements TodoRepository {
  private readonly todos = new Map<string, Todo>()

  async save(todo: Todo): Promise<void> {
    const id = todo.toJSON().id
    this.todos.set(id, todo)
  }

  async findById(id: TodoId): Promise<Todo | null> {
    return this.todos.get(id.toString()) || null
  }

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values())
  }

  async delete(id: TodoId): Promise<void> {
    this.todos.delete(id.toString())
  }
}
