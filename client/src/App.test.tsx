import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

// Minimal test to check if the App renders without crashing
// Deep testing of routes would require more setup
describe('App Component', () => {
  it('renders login link when not authenticated', () => {
    render(<App />)
    expect(screen.getAllByText('Login').length).toBeGreaterThan(0)
  })

  it('renders logo', () => {
    render(<App />)
    expect(screen.getByText('TodoApp')).toBeInTheDocument()
  })
})
