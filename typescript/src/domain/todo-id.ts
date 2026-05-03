import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

export class TodoId {
  private constructor(private readonly value: string) {}

  public static create(): TodoId {
    return new TodoId(uuidv4())
  }

  public static fromString(value: string): TodoId {
    if (!uuidValidate(value)) {
      throw new Error('Invalid TodoId')
    }
    return new TodoId(value)
  }

  public toString(): string {
    return this.value
  }

  public equals(other: TodoId): boolean {
    return this.value === other.value
  }
}
