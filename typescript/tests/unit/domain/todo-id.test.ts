import { describe, it, expect } from 'vitest'
import { TodoId } from '../../../src/domain/todo-id.js'

describe('TodoId', () => {
  it('should create a valid TodoId', () => {
    const todoId = TodoId.create()
    expect(todoId).toBeDefined()
    expect(typeof todoId.toString()).toBe('string')
    expect(todoId.toString().length).toBeGreaterThan(0)
  })

  it('should be created from a valid string', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const todoId = TodoId.fromString(uuid)
    expect(todoId.toString()).toBe(uuid)
  })

  it('should throw error for invalid string', () => {
    expect(() => TodoId.fromString('invalid-uuid')).toThrow('Invalid TodoId')
  })

  it('should check for equality', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const id1 = TodoId.fromString(uuid)
    const id2 = TodoId.fromString(uuid)
    const id3 = TodoId.create()

    expect(id1.equals(id2)).toBe(true)
    expect(id1.equals(id3)).toBe(false)
  })
})
