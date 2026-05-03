import { TodoId } from './todo-id.js'
import type { TodoTitle } from './todo-title.js'

class TodoTimestamps {
  constructor(
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static now(): TodoTimestamps {
    const now = new Date()
    return new TodoTimestamps(now, now)
  }

  update(): TodoTimestamps {
    return new TodoTimestamps(this.createdAt, new Date())
  }
}

class TodoStatus {
  constructor(
    public readonly completed: boolean,
    public readonly timestamps: TodoTimestamps,
  ) {}
}

class TodoDetails {
  constructor(
    public readonly title: TodoTitle,
    public readonly status: TodoStatus,
  ) {}
}

export class Todo {
  private constructor(
    private readonly id: TodoId,
    private details: TodoDetails,
  ) {}

  static create(title: TodoTitle): Todo {
    const status = new TodoStatus(false, TodoTimestamps.now())
    const details = new TodoDetails(title, status)
    return new Todo(TodoId.create(), details)
  }

  complete(): void {
    const newStatus = new TodoStatus(true, this.details.status.timestamps.update())
    this.details = new TodoDetails(this.details.title, newStatus)
  }

  updateTitle(title: TodoTitle): void {
    const newStatus = new TodoStatus(
      this.details.status.completed,
      this.details.status.timestamps.update(),
    )
    this.details = new TodoDetails(title, newStatus)
  }

  toJSON() {
    return {
      id: this.id.toString(),
      title: this.details.title.toString(),
      completed: this.details.status.completed,
      createdAt: this.details.status.timestamps.createdAt,
      updatedAt: this.details.status.timestamps.updatedAt,
    }
  }
}
