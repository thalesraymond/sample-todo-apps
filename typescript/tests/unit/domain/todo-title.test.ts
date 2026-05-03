import { describe, it, expect } from 'vitest'
import { TodoTitle } from '../../../src/domain/todo-title.js'

describe('TodoTitle', () => {
  it('should create a valid TodoTitle', () => {
    const title = 'Buy milk'
    const todoTitle = TodoTitle.fromString(title)
    expect(todoTitle.toString()).toBe(title)
  })

  it('should throw error if title is empty', () => {
    expect(() => TodoTitle.fromString('')).toThrow('Todo title cannot be empty')
  })

  it('should throw error if title is too long', () => {
    const longTitle = 'a'.repeat(256)
    expect(() => TodoTitle.fromString(longTitle)).toThrow('Todo title is too long')
  })

  it('should check for equality', () => {
    const title = 'Buy milk'
    const t1 = TodoTitle.fromString(title)
    const t2 = TodoTitle.fromString(title)
    const t3 = TodoTitle.fromString('Buy bread')

    expect(t1.equals(t2)).toBe(true)
    expect(t1.equals(t3)).toBe(false)
  })
})
