import type { Todo } from './todo.js'
import type { TodoId } from './todo-id.js'

export interface TodoRepository {
  save(todo: Todo): Promise<void>
  findById(id: TodoId): Promise<Todo | null>
  findAll(): Promise<Todo[]>
  delete(id: TodoId): Promise<void>
}
