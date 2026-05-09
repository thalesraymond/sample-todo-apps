import type { TodoRepository } from '../domain/todo-repository.js'
import type { Todo } from '../domain/todo.js'
import type { TodoId } from '../domain/todo-id.js'

export class InMemoryTodoRepository implements TodoRepository {
  private readonly todos = new Map<string, Todo>()

  async save(todo: Todo): Promise<void> {
    const id = todo.toJSON().id
    this.todos.set(id, todo)
  }

  async findById(id: TodoId, userId: string): Promise<Todo | null> {
    const todo = this.todos.get(id.toString())
    if (todo && todo.toJSON().userId === userId) {
      return todo
    }
    return null
  }

  async findAll(userId: string): Promise<Todo[]> {
    return Array.from(this.todos.values()).filter((todo) => todo.toJSON().userId === userId)
  }

  async delete(id: TodoId, userId: string): Promise<void> {
    const todo = this.todos.get(id.toString())
    if (todo && todo.toJSON().userId === userId) {
      this.todos.delete(id.toString())
    }
  }
}
