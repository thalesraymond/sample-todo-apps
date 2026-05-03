export class TodoTitle {
  private constructor(private readonly value: string) {}

  public static fromString(value: string): TodoTitle {
    if (value.length === 0) {
      throw new Error('Todo title cannot be empty')
    }
    if (value.length > 255) {
      throw new Error('Todo title is too long')
    }
    return new TodoTitle(value)
  }

  public toString(): string {
    return this.value
  }

  public equals(other: TodoTitle): boolean {
    return this.value === other.value
  }
}
